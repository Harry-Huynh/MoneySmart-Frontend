"use server";
import { getAllSavingGoals } from "@/lib/savingGoal.actions";
import { getToken } from "@/lib/user.actions";
import { GoogleGenAI } from "@google/genai";
import { readFile } from "fs/promises";
import path from "path";

async function getRecentThreeMonthsTransactions(chosenMonth, chosenYear) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const results = [];

  for (let i = 0; i < 3; i++) {
    const date = new Date(Date.UTC(chosenYear, chosenMonth, 1));
    date.setUTCMonth(date.getUTCMonth() - i);

    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions?month=${month}&year=${year}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || `Failed to fetch transactions for month ${month}`,
      );
    }

    results.push({
      month: monthNames[month],
      year,
      transactions: data.transactions ?? [],
    });
  }

  return results;
}

async function getRecentThreeMonthsBudgets(chosenMonth, chosenYear) {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/budgets?endMonth=${chosenMonth}&endYear=${chosenYear}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(
      res.message || "Failed to fetch budgets for recent 3 months",
    );
  }

  return await res.json();
}

async function getAllFinancialInformationInRecentThreeMonths(
  chosenMonth,
  chosenYear,
) {
  const [threeMonthTransactions, budgetsRes, savingGoalsRes] =
    await Promise.all([
      getRecentThreeMonthsTransactions(chosenMonth, chosenYear),
      getRecentThreeMonthsBudgets(chosenMonth, chosenYear),
      getAllSavingGoals(),
    ]);

  return {
    analysisMonth: `${chosenYear}-${String(chosenMonth + 1).padStart(2, "0")}`,
    threeMonthTransactions,
    budgets: budgetsRes.budgets || [],
    savingGoals: savingGoalsRes.savingGoals || [],
  };
}

export async function getTransactionsForAnalysisMonth(chosenMonth, chosenYear) {
  const token = await getToken();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions?month=${chosenMonth}&year=${chosenYear}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch transactions");
  }

  return data.transactions ?? [];
}

export async function conductSystemPromptAndUserPrompt(
  chosenMonth,
  chosenYear,
) {
  const systemPrompt = await readFile(
    path.join(process.cwd(), "src/AI/systemPrompt.md"),
    "utf-8",
  );
  const userPrompt = await getAllFinancialInformationInRecentThreeMonths(
    chosenMonth,
    chosenYear,
  );

  return await callingLLM(systemPrompt, userPrompt);
}

async function callingLLM(systemPrompt, userPromptData) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const userPrompt = `Here is the financial dataset in JSON format. Analyze it based on the system instruction. 
  ${JSON.stringify(userPromptData, null, 2)}`;

  // List of models to try in order
  const models = [
    "gemini-2.5-flash",
    "gemini-3.1-flash-lite-preview",
    "gemini-2.5-flash-lite",
    "gemini-3-flash-preview",
  ];

  let lastError;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        config: {
          systemInstruction: systemPrompt,
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
      });

      const rawText = response.text ?? "";
      const cleanedText = rawText
        .replace(/```json\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

      const output = JSON.parse(cleanedText);

      // If parsing succeeds, return immediately
      return output;
    } catch (err) {
      lastError = err;

      // If quota exceeded, log and continue to next model
      if (err?.error) {
        continue;
      }
    }
  }

  // If all models fail
  throw new Error(
    `All models failed. Last error: ${lastError?.message || lastError}`,
  );
}
