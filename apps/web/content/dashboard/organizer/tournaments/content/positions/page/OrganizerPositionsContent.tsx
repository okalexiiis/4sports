/* COMPONENTS */
import { SectionContainer } from "@/content/shared/ui/sectionContainer/SectionContainer";
import { PositionsTable } from "../components/positionsTable/PositionsTable";

export function OrganizerPositionsContent() {
  return (
    <SectionContainer>
      <div className="p-6 flex flex-col h-full">
        <PositionsTable />
      </div>
    </SectionContainer>
  );
}
