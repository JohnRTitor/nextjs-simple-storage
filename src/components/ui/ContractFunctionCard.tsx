export default function ContractFunctionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-700 border border-gray-200 shadow rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-lg">{title}</h3>
      {children}
    </div>
  );
}
