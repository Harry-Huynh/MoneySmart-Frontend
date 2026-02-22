// src/lib/savingGoalNotification.actions.js
import { toast } from "sonner";
import { RiAlarmWarningFill } from "react-icons/ri";
import {
  RiProgress1Line,
  RiProgress3Line,
  RiProgress4Line,
  RiProgress6Line,
} from "react-icons/ri";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { getOneSavingGoal } from "@/lib/savingGoal.actions";
import { formatCurrencyCAD } from "@/lib/utils";

const MILESTONE_THRESHOLDS = [
  { milestoneKey: "P30", thresholdRatio: 0.3, label: "30%" },
  { milestoneKey: "P50", thresholdRatio: 0.5, label: "50%" },
  { milestoneKey: "P80", thresholdRatio: 0.8, label: "80%" },
];

const NOTIFICATION_TYPE = "SAVING_GOAL";
const DELIVERY_METHOD = "PUSH_NOTIFICATION";

function getSavingGoalToastUI(milestoneKey, notificationLevel) {
  if (notificationLevel === "SUCCESS" || milestoneKey === "ACHIEVED") {
    return { icon: <IoMdCheckmarkCircle /> };
  }

  switch (milestoneKey) {
    case "EXCEEDED":
      return { icon: <RiAlarmWarningFill /> };
    case "P80":
      return { icon: <RiProgress6Line /> };
    case "P50":
      return { icon: <RiProgress4Line /> };
    case "P30":
      return { icon: <RiProgress3Line /> };
    default:
      return { icon: <RiProgress1Line /> };
  }
}

export function shouldNotifySavingGoal(savingGoalId, milestoneKey) {
  return Boolean(savingGoalId && milestoneKey);
}

function calculateProgressRatio(savedAmount, targetAmount) {
  const parsedTargetAmount = Number(targetAmount || 0);
  if (parsedTargetAmount <= 0) return 0;
  return Number(savedAmount || 0) / parsedTargetAmount;
}

export async function createSavingGoalNotificationDataByMilestones(
  savingGoalId,
  addedAmount,
) {
  const savingGoalResponse = await getOneSavingGoal(savingGoalId);
  const savingGoal =
    savingGoalResponse.savingGoal ||
    savingGoalResponse.goal ||
    savingGoalResponse;

  const savingGoalName = savingGoal.purpose ?? savingGoal.name ?? "Saving Goal";
  const targetAmount = Number(savingGoal.targetAmount || 0);

  // addTransaction has already updated currentAmount in backend before this call.
  const savedAmountAfterTransaction = Number(
    savingGoal.currentAmount ?? savingGoal.savedAmount ?? 0,
  );
  const transactionAmount = Number(addedAmount || 0);
  const savedAmountBeforeTransaction = Math.max(
    0,
    savedAmountAfterTransaction - transactionAmount,
  );

  const progressRatioBeforeTransaction = calculateProgressRatio(
    savedAmountBeforeTransaction,
    targetAmount,
  );
  const progressRatioAfterTransaction = calculateProgressRatio(
    savedAmountAfterTransaction,
    targetAmount,
  );

  // Goal already achieved before this transaction, user keeps adding more.
  if (progressRatioBeforeTransaction >= 1 && transactionAmount > 0) {
    return {
      type: NOTIFICATION_TYPE,
      title: "Saving Goal Exceeded",
      message: `You added ${formatCurrencyCAD(transactionAmount)} after reaching the target ${formatCurrencyCAD(targetAmount)} for "${savingGoalName}".`,
      deliveryMethod: DELIVERY_METHOD,
      level: "WARNING",
      milestone: "EXCEEDED",
    };
  }

  // Crossing 100% for the first time.
  if (
    progressRatioAfterTransaction >= 1 &&
    progressRatioBeforeTransaction < 1
  ) {
    const exceededAmount = Math.max(
      0,
      savedAmountAfterTransaction - targetAmount,
    );

    return {
      type: NOTIFICATION_TYPE,
      title:
        exceededAmount > 0
          ? "Goal Achieved (Exceeded)"
          : "Saving Goal Achieved",
      message:
        exceededAmount > 0
          ? `You achieved "${savingGoalName}" and exceeded by ${formatCurrencyCAD(exceededAmount)}.`
          : `You achieved "${savingGoalName}". Great job!`,
      deliveryMethod: DELIVERY_METHOD,
      level: "SUCCESS",
      milestone: "ACHIEVED",
    };
  }

  // If multiple thresholds are crossed in one transaction, notify highest one.
  const highestCrossedMilestone = [...MILESTONE_THRESHOLDS]
    .reverse()
    .find(
      (milestoneThreshold) =>
        progressRatioBeforeTransaction < milestoneThreshold.thresholdRatio &&
        progressRatioAfterTransaction >= milestoneThreshold.thresholdRatio,
    );

  if (highestCrossedMilestone) {
    return {
      type: NOTIFICATION_TYPE,
      title: `Saving Goal Progress ${highestCrossedMilestone.label}`,
      message: `You're at ${highestCrossedMilestone.label} for "${savingGoalName}" (${formatCurrencyCAD(savedAmountAfterTransaction)} saved of ${formatCurrencyCAD(targetAmount)}).`,
      deliveryMethod: DELIVERY_METHOD,
      level: "INFO",
      milestone: highestCrossedMilestone.milestoneKey,
    };
  }

  return null;
}

export const createSavingGoalPushNotification = (
  savingGoalNotificationData,
) => {
  const { icon } = getSavingGoalToastUI(
    savingGoalNotificationData.milestone,
    savingGoalNotificationData.level,
  );

  const toastContent = (
    <div className="flex items-center gap-3">
      <div className="text-xl self-center">{icon}</div>
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-md">
          {savingGoalNotificationData.title}
        </span>
        <span className="text-sm opacity-90">
          {savingGoalNotificationData.message}
        </span>
      </div>
    </div>
  );

  if (savingGoalNotificationData.level === "SUCCESS") {
    return toast(toastContent, {
      style: {
        background: "#16a34a",
        color: "#fff",
        padding: "1rem",
        maxWidth: "350px",
      },
    });
  }

  return toast(toastContent, {
    style: {
      background:
        savingGoalNotificationData.level === "WARNING" ? "#dc2626" : "#16a33a",
      color: "#fff",
      padding: "1rem",
      maxWidth: "350px",
    },
  });
};
