export function DinamicRow({
  twBgColor,
  children,
}: {
  twBgColor: string;
  children: React.ReactNode;
}) {
  return (
    <tr
      className={`border-b border-b-line hover:bg-primary-background group transition-all relative duration-200 ${twBgColor}`}
    >
      {children}
    </tr>
  );
}
