const money = (n) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(Number(n || 0));

const dateStr = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

function buildEmailContent(type, payload) {
  const name = payload.customerName ? `Hi ${payload.customerName},` : "Hi,";
  const app = "MoneySmart";

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (type === "BUDGET_THRESHOLD") {
    return {
      subject: `[${app}] Budget warning: ${payload.purpose}`,
      title: `${name} Budget warning`,
      badge: "Budget Alert",
      severity: "warning",
      summary: `Your budget "${payload.purpose}" is close to the threshold.`,
      details: [
        { label: "Budget amount", value: money(payload.amount) },
        { label: "Used amount", value: money(payload.usedAmount) },
        { label: "Threshold", value: money(payload.thresholdAmount) },
        { label: "End date", value: dateStr(payload.endDate) },
      ],
      cta_text: "Review budgets",
      cta_url: `${APP_URL}/budgets`,
      footer_note: "Reduce optional spending until the budget resets.",
    };
  }

  if (type === "BUDGET_OVERSPENT") {
    const overBy = Number(payload.usedAmount) - Number(payload.amount);
    return {
      subject: `[${app}] Overspent: ${payload.purpose}`,
      title: `${name} Budget overspent`,
      badge: "Budget Alert",
      severity: "danger",
      summary: `You exceeded your budget "${payload.purpose}".`,
      details: [
        { label: "Budget amount", value: money(payload.amount) },
        { label: "Used amount", value: money(payload.usedAmount) },
        { label: "Over by", value: money(overBy) },
      ],
      cta_text: "View spending",
      cta_url: `${APP_URL}/transactions`,
      footer_note: "Adjust spending or increase the budget next cycle.",
    };
  }

  if (type === "GOAL_MILESTONE") {
    return {
      subject: `[${app}] Milestone reached: ${payload.purpose}`,
      title: `${name} Saving goal milestone`,
      badge: "Saving Goal",
      severity: "success",
      summary: `You reached ${payload.milestone}% of "${payload.purpose}"!`,
      details: [
        { label: "Current", value: money(payload.currentAmount) },
        { label: "Target", value: money(payload.targetAmount) },
        { label: "Target date", value: dateStr(payload.targetDate) },
      ],
      cta_text: "View goals",
      cta_url: `${APP_URL}/saving-goals`,
      footer_note: "Keep going — you're doing great.",
    };
  }

  if (type === "GOAL_ACHIEVED") {
    return {
      subject: `[${app}] Goal achieved 🎉 ${payload.purpose}`,
      title: `${name} You achieved your goal!`,
      badge: "Saving Goal",
      severity: "success",
      summary: `You reached 100% of "${payload.purpose}". Amazing job!`,
      details: [
        { label: "Saved", value: money(payload.currentAmount) },
        { label: "Target", value: money(payload.targetAmount) },
      ],
      cta_text: "Create another goal",
      cta_url: `${APP_URL}/saving-goals/add`,
      footer_note: "Start your next goal while you're motivated.",
    };
  }

  return null;
}

export { buildEmailContent };