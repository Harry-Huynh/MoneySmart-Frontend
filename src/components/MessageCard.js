export default function MessageCard({ children, title, subtitle }) {
  return (
    <div className="flex flex-col flex-wrap items-center justify-center mt-10 shadow-200 p-2 rounded-2xl min-h-60 xl:min-h-50 min-w-60 lg:min-w-75 ">
      {children}
      <h2 className="mt-2 text-lg xl:text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-center">{subtitle}</p>
    </div>
  );
}
