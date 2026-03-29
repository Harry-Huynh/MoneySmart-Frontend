import { RiAlarmWarningFill } from "react-icons/ri";
import { BiSolidErrorAlt } from "react-icons/bi";
import { FaCircleInfo } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const success = "SUCCESS";
const warning = "WARNING";
const error = "ERROR";
const info = "INFO";

function getCardStyle(level) {
  switch (level) {
    case error:
      return "bg-red-100";
    case warning:
      return "bg-amber-100";
    case info:
      return "bg-blue-100";
    case success:
    default:
      return "bg-emerald-100";
  }
}

function getIconStyle(level) {
  switch (level) {
    case error:
      return "bg-red-300 text-red-600";
    case warning:
      return "bg-amber-300 text-amber-600";
    case info:
      return "bg-blue-300 text-blue-600";
    case success:
    default:
      return "bg-emerald-300 text-emerald-600";
  }
}

function renderIcon(level) {
  switch (level) {
    case error:
      return <BiSolidErrorAlt size={22} />;
    case warning:
      return <RiAlarmWarningFill size={22} />;
    case info:
      return <FaCircleInfo size={22} />;
    case success:
    default:
      return <FaCheckCircle size={22} />;
  }
}

export default function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
}) {
  const unread = !notification.isRead;
  const level = notification.level;

  return (
    <div
      className={`relative flex items-center gap-3 overflow-hidden rounded-xl border border-gray-200 px-4 py-4 ${getCardStyle(level)}`}
    >
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          unread ? "bg-blue-500" : "bg-transparent"
        }`}
      />

      <div className={`ml-2 shrink-0 rounded-lg p-2 ${getIconStyle(level)}`}>
        {renderIcon(level)}
      </div>

      <div className="min-w-0 flex-1">
        <p className={`${unread ? "font-semibold" : "font-medium"} break-words`}>
          {notification.title}
        </p>

        <p
          className={`text-sm break-words ${
            unread ? "font-semibold text-gray-700" : "text-gray-500"
          }`}
        >
          {notification.subtitle}
        </p>

        {notification.amount !== undefined && notification.amount !== null && (
          <p className="mt-1 text-sm text-gray-600">
            ${Number(notification.amount).toFixed(2)}
          </p>
        )}
      </div>

      <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
  {unread && (
    <button
      onClick={() => onMarkRead(notification.id)}
      className="h-10 px-3 text-sm border border-gray-300 rounded-md text-blue-600 bg-white hover:bg-gray-50 cursor-pointer"
      type="button"
    >
      Mark as read
    </button>
  )}

  <button
    onClick={() => onDelete(notification.id)}
    className="h-10 sm:w-10 flex items-center justify-center border border-gray-300 rounded-md text-gray-500 bg-white hover:bg-red-50 hover:text-red-600 cursor-pointer"
    title="Delete"
    type="button"
  >
    <MdDelete size={18} />
  </button>
</div>
    </div>
  );
}