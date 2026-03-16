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
    threeMonthTransactions,
    budgets: budgetsRes.budgets || [],
    savingGoals: savingGoalsRes.savingGoals || [],
  };
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
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const userPrompt = `Here is the financial dataset in JSON format. Analyze it based on the system instruction. 
  ${JSON.stringify(userPromptData, null, 2)}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
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
  return response.text;
}
