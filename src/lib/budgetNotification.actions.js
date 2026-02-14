import { toast } from "sonner";
import { getOneBudget } from "./budget.actions";

export const createNotificationData = async (budgetId) => {
  try {
    const result = await getOneBudget(budgetId);
    const budget = result.budget;

    const usedAmount = Number(budget.usedAmount);
    const totalAmount = Number(budget.amount);
    const thresholdAmount = Number(budget.thresholdAmount);
    const progress = (budget.usedAmount / budget.amount) * 100;

    const notificationData = {
      type: "BUDGET",
      title: "Budget Warnings",
      deliveryMethod: "PUSH_NOTIFICATION",
      status: "UNREAD",
    };

    if (progress >= 50 && progress < 80) {
      notificationData.message = `You have used more than 50% of ${budget.purpose}`;
    } else if (progress >= 80) {
      notificationData.message = `You have used more than 80% of ${budget.purpose}`;
    } else if (totalAmount - usedAmount <= thresholdAmount) {
      notificationData.message = `You have used more than ${thresholdAmount} of ${budget.purpose}`;
    }

    return notificationData;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const createBudgetPushNotification = (notificationData) => {
  return toast.warning(
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-md">{notificationData.title}</span>
      <span className="text-sm opacity-90">{notificationData.message}</span>
    </div>,
    {
      style: {
        background: "#dc2626",
        color: "#fff",
        padding: "1rem",
        "max-width": "350px",
      },
    },
  );
};
