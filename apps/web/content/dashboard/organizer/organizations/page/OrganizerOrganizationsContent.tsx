"use client";

/* COMPONENTS */
import { SectionContainer } from "@/content/shared/ui/sectionContainer/SectionContainer";
import { OrganizationCard } from "./components/organizationCard/OrganizationCard";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

/* ICONS */
import { Plus } from "lucide-react";

/* IMAGES */
import organization1 from "./images/organization1.png";
import organization2 from "./images/organization2.png";
import organization3 from "./images/organization3.png";
import banner1 from "./images/banner1.jpg";

/* NAVIGATION */
import { useRouter } from "next/navigation";

/* TYPES */
import { OrganizationCardType } from "./components/organizationCard/types/OrganizationCardType";

const organizations: OrganizationCardType[] = [
  {
    name: "Sede Deportes",
    description: "La mejor sede de deportes en todo Sonora, México",
    image: organization1,
    isSelected: true,
    slug: "sede-deportes",
    role: "owner",
    banner: banner1
  },
  {
    name: "Fix Mobile",
    description:
      "Organización para gestionar los torneos internos de nuestros empleados",
    image: organization2,
    isSelected: false,
    slug: "fix-mobile",
    role: "admin",
    banner: banner1
  },
  {
    name: "Gran Maquina",
    description: "Organizamos los mejores torneos de la zona sur de Nogales",
    image: organization3,
    isSelected: false,
    slug: "gran-maq",
    role: "organizer",
    banner: banner1
  },
];

export function OrganizerOrganizationsContent() {
  const router = useRouter();

  return (
    <SectionContainer>
      <div className="p-6 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <p className="font-bebas text-5xl text-ink">
            Mis <span className="text-primary">Organizaciones</span>
          </p>

          <DinamicButton
            action={() => router.push("/organizer/organizations/add")}
            twClassName="w-fit pt-1 pb-1 text-sm"
            type={"filled"}
            label="Nueva organización"
            icon={<Plus className="size-4 min-h-4 min-w-4" />}
          />
        </div>

        <p className="text-xl font-extralight mb-6">
          Selecciona una organización para gestionar sus torneos
        </p>

        <div className="grid gap-6 grid-cols-3">
          {organizations.map((o, i) => (
            <OrganizationCard
              key={i}
              name={o.name}
              description={o.description}
              image={o.image}
              isSelected={o.isSelected}
              slug={o.slug}
              role={o.role}
              banner={o.banner}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
