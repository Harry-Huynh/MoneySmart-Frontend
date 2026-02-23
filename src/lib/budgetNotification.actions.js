import { toast } from "sonner";
import { getOneBudget } from "./budget.actions";
import { formatCurrencyCAD } from "@/lib/utils";
import { RiAlarmWarningFill } from "react-icons/ri";
import { BiSolidErrorAlt } from "react-icons/bi";

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
      level: "WARNING",
    };

    const EPSILON = 0.01;

    if (usedAmount > totalAmount) {
      notificationData.message = `You have exceeded your budget of ${formatCurrencyCAD(totalAmount)} for ${budget.purpose}`;
      notificationData.level = "ERROR";
      notificationData.title = "Budget Exceeded";
    } else if (Math.abs(usedAmount - totalAmount) < EPSILON) {
      notificationData.message = `You have used all of your budget of ${formatCurrencyCAD(totalAmount)} for ${budget.purpose}`;
    } else if (progress >= 80 && totalAmount - usedAmount > thresholdAmount) {
      notificationData.message = `You have used more than 80% of ${budget.purpose}`;
    } else if (
      progress >= 50 &&
      progress < 80 &&
      totalAmount - usedAmount > thresholdAmount
    ) {
      notificationData.message = `You have used more than 50% of ${budget.purpose}`;
    } else if (totalAmount - usedAmount <= thresholdAmount) {
      notificationData.message = `You have reached the threshold of ${formatCurrencyCAD(thresholdAmount)} for ${budget.purpose}`;
    }

    return notificationData;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const createBudgetPushNotification = (notificationData) => {
  const backgroundColor = {
    WARNING: "#FFD54F",
    ERROR: "#F44336",
  };

  const level = notificationData.level;

  return toast(
    <div
      className={`flex flex-row items-center gap-3 ${level === "ERROR" ? "text-white" : "text-black"}`}
    >
      <div className="text-xl self-center">
        {notificationData.level === "ERROR" ? (
          <BiSolidErrorAlt />
        ) : (
          <RiAlarmWarningFill />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-md">{notificationData.title}</span>
        <span className="text-sm opacity-90">{notificationData.message}</span>
      </div>
    </div>,
    {
      style: {
        background: backgroundColor[notificationData.level],
        padding: "1rem",
        "max-width": "350px",
      },
    },
  );
};
