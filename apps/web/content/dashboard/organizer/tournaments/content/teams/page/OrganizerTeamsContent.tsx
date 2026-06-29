/* COMPONENTS */
import { SectionContainer } from "@/content/shared/ui/sectionContainer/SectionContainer";
import { TeamsTable } from "../components/teamsTable/TeamsTable";

export function OrganizerTeamsContent() {
  return (
    <SectionContainer>
      <div className="p-6 flex flex-col h-full">
        <TeamsTable />
      </div>
    </SectionContainer>
  );
}
