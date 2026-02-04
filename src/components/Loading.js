export default function Loading() {
  return (
    <div className="fixed inset-0 z-75 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="h-20 w-20 animate-spin rounded-full border-5 border-white border-t-transparent" />
    </div>
  );
}
