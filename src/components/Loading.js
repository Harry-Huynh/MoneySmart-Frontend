export default function Loading({ embedded = false }) {
  return (
    <div
      className={`${embedded ? "w-full min-h-[320px] rounded-2xl bg-gray-50/80" : "fixed inset-0 z-75 bg-black/40 backdrop-blur-sm"} flex items-center justify-center`}
    >
      <div
        className={`h-20 w-20 animate-spin rounded-full border-5 ${embedded ? "border-[#4f915f] border-t-transparent" : "border-white border-t-transparent"}`}
      />
    </div>
  );
}
