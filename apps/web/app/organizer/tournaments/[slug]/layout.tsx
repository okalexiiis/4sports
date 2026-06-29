/* COMPONENTS */
import { InternalNavbar } from "@/content/shared/ui/internalNavbar/InternalNavbar";

export default function TournamentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full">
      <InternalNavbar to="tournament" />

      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
