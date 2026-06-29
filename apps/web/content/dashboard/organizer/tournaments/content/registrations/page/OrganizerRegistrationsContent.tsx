/* COMPONENTS */
import { SectionContainer } from "@/content/shared/ui/sectionContainer/SectionContainer";
import { RegistrationsTable } from "../components/registrationsTable/RegistrationsTable";

export function OrganizerRegistrationsContent() {
  return (
    <SectionContainer>
      <div className="p-6 flex flex-col h-full">
        <RegistrationsTable />
      </div>
    </SectionContainer>
  );
}
