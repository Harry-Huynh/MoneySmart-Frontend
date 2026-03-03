const money = (n) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
    Number(n || 0),
  );

const dateStr = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

function getSeverityColors(severity) {
  switch (severity) {
    case "Success":
      return { bg: "#16a34a", color: "#ffffff" }; 
    case "Warning":
      return { bg: "#facc15", color: "#000000" }; 
    case "Danger":
      return { bg: "#dc2626", color: "#ffffff" }; 
    case "Info":
      return { bg: "#3b82f6", color: "#ffffff" }; 
    default:
      return { bg: "#e5e7eb", color: "#000000" }; 
  }
}
function buildEmailContent(type, payload) {
  const name = payload.customerName ? `Hi ${payload.customerName},` : "Hi,";
  const app = "MoneySmart";

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (type === "BUDGET_THRESHOLD") {
    const { bg, color } = getSeverityColors("Warning");
    return {
      subject: `[${app}] Budget warning: ${payload.purpose}`,
      title: `${name} Budget warning`,
      badge: "Budget Alert",
      severity: "Warning",
      severity_bg: bg,
      severity_color: color,
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

  if (type === "BUDGET_EXCEEDED") {
    const { bg, color } = getSeverityColors("Danger");
    const overBy = Number(payload.usedAmount) - Number(payload.amount);
    return {
      subject: `[${app}] Overspent: ${payload.purpose}`,
      title: `${name} Budget overspent`,
      badge: "Budget Alert",
      severity: "Danger",
      severity_bg: bg,
  severity_color: color,
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

  if (type === "BUDGET_USED_ALL") {
    const { bg, color } = getSeverityColors("Warning");
  return {
    subject: `[${app}] Budget fully used: ${payload.purpose}`,
    title: `${name} Budget fully used`,
    badge: "Budget Alert",
    severity: "Warning",
    severity_bg: bg,
      severity_color: color,
    summary: `You have used 100% of your budget "${payload.purpose}".`,
    details: [
      { label: "Budget amount", value: money(payload.amount) },
      { label: "Used amount", value: money(payload.usedAmount) },
      { label: "End date", value: dateStr(payload.endDate) },
    ],
    cta_text: "Review spending",
    cta_url: `${APP_URL}/transactions`,
    footer_note: "Be careful with additional expenses until the budget resets.",
  };
}

if (type === "BUDGET_PROGRESS_80") {
  const { bg, color } = getSeverityColors("Warning");
  return {
    subject: `[${app}] 80% of budget used: ${payload.purpose}`,
    title: `${name} Budget at 80%`,
    badge: "Budget Alert",
    severity: "Warning",
    severity_bg: bg,
      severity_color: color,
    summary: `You have used more than 80% of "${payload.purpose}".`,
    details: [
      { label: "Budget amount", value: money(payload.amount) },
      { label: "Used amount", value: money(payload.usedAmount) },
      { label: "Progress", value: `${Math.round(payload.progress)}%` },
      { label: "End date", value: dateStr(payload.endDate) },
    ],
    cta_text: "Review budgets",
    cta_url: `${APP_URL}/budgets`,
    footer_note: "You are approaching your spending limit.",
  };
}

if (type === "BUDGET_PROGRESS_50") {
  const { bg, color } = getSeverityColors("Info");
  return {
    subject: `[${app}] 50% of budget used: ${payload.purpose}`,
    title: `${name} Budget at 50%`,
    badge: "Budget Alert",
    severity: "Info",
    severity_bg: bg,
      severity_color: color,
    summary: `You have used more than 50% of "${payload.purpose}".`,
    details: [
      { label: "Budget amount", value: money(payload.amount) },
      { label: "Used amount", value: money(payload.usedAmount) },
      { label: "Progress", value: `${Math.round(payload.progress)}%` },
      { label: "End date", value: dateStr(payload.endDate) },
    ],
    cta_text: "Review budgets",
    cta_url: `${APP_URL}/budgets`,
    footer_note: "Keep an eye on your spending.",
  };
}

// saving goal
  if (type === "GOAL_MILESTONE") {
    const { bg, color } = getSeverityColors("Success");
    return {
      subject: `[${app}] Milestone reached: ${payload.purpose}`,
      title: `${name} Saving goal milestone`,
      badge: "Saving Goal",
      severity: "Success",
      severity_bg: bg,
      severity_color: color,
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
    const { bg, color } = getSeverityColors("Success");
    return {
      subject: `[${app}] Goal achieved 🎉 ${payload.purpose}`,
      title: `${name} You achieved your goal!`,
      badge: "Saving Goal",
      severity: "Success",
      severity_bg: bg,
      severity_color: color,
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

  if (type === "GOAL_EXCEEDED") {
  const exceededBy = Number(payload.exceededBy ?? (Number(payload.currentAmount) - Number(payload.targetAmount)));
  const { bg, color } = getSeverityColors("Warning");
  return {
    subject: `[${app}] Goal exceeded: ${payload.purpose}`,
    title: `${name} Saving goal exceeded`,
    badge: "Saving Goal",
    severity: "Warning",
    severity_bg: bg,
      severity_color: color,
    summary: `You already achieved "${payload.purpose}" and saved more than the target.`,
    details: [
      { label: "Current", value: money(payload.currentAmount) },
      { label: "Target", value: money(payload.targetAmount) },
      { label: "Exceeded by", value: money(exceededBy) },
      { label: "Target date", value: dateStr(payload.targetDate) },
    ],
    cta_text: "View goals",
    cta_url: `${APP_URL}/saving-goals`,
    footer_note: "Consider increasing the target or creating a new goal.",
  };
}
  return null;
}

export { buildEmailContent };
