export function DinamicTh({ column }: { column: string }) {
  return (
    <th
      className={`font-bold py-2 text-left text-ink ${
        column === ""
          ? "px-0 bg-surface sticky right-0 whitespace-nowrap"
          : "px-6"
      }`}
    >
      {column}
    </th>
  );
}
