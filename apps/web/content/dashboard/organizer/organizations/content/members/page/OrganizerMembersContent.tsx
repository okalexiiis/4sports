/* COMPONENTS */
import { SectionContainer } from "@/content/shared/ui/sectionContainer/SectionContainer";
import { OrganizationMembersTable } from "../components/membersTable/OrganizationMembersTable";

export function OrganizerMembersContent() {
  return (
    <SectionContainer>
      <div className="p-6 flex flex-col h-full">
        <OrganizationMembersTable />
      </div>
    </SectionContainer>
  );
}
