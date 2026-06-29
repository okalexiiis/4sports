export function DinamicTd({
  children,
  twClassName,
}: {
  children: React.ReactNode;
  twClassName: string;
}) {
  return <td className={`px-6 py-3 text-left ${twClassName}`}>{children}</td>;
}
