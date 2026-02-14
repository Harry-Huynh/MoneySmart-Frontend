import { MdDelete, MdDone } from "react-icons/md";

export default function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
}) {
  const unread = !notification.isRead;
  const isDelete = notification.type === "delete";

  return (
    <div className="relative flex items-center gap-4 px-4 py-4 rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* for status bar inside the card */}
      <div
        className={`absolute left-0 top-0 h-full w-1
          ${unread ? "bg-blue-500" : "bg-transparent"}`}
      />

      <div
        className={`
          ml-2 p-2 rounded-lg
          ${isDelete ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}
      >
        {isDelete ? <MdDelete size={22} /> : <MdDone size={22} />}
      </div>

      <div className="flex-1">
        <p className={unread ? "font-semibold" : "font-medium"}>
          {notification.title}
        </p>

        <p
          className={`text-sm ${unread ? "font-semibold text-gray-700" : "text-gray-500"}`}
        >
          {notification.subtitle}
        </p>

        {notification.amount !== undefined && notification.amount !== null && (
          <p className="mt-1 text-sm text-gray-600">${notification.amount}</p>
        )}
      </div>

      {/* Button here */}
      <div className="flex items-center gap-2">
        {unread && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="
              px-3 py-1.5 text-sm
              border border-gray-300 rounded-md
              text-blue-600 bg-white
              hover:bg-gray-50
              cursor-pointer
            "
            type="button"
          >
            {" "}
            Mark as read
          </button>
        )}

        <button
          onClick={() => onDelete(notification.id)}
          className="
            p-2 border border-gray-300 rounded-md
            text-gray-500 bg-white
            hover:bg-red-50 hover:text-red-600
            cursor-pointer
          "
          title="Delete"
          type="button"
        >
          <MdDelete size={18} />
        </button>
      </div>
    </div>
  );
}
