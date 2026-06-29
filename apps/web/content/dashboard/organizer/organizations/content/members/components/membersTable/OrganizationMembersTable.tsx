"use client";

/* COMPONENTS */
import { DinamicTableBody } from "@/content/shared/ui/dinamicTable/components/dinamicTableBody/DinamicTableBody";
import { DinamicTableFooter } from "@/content/shared/ui/dinamicTable/components/dinamicTableFooter/DinamicTableFooter";
import { DinamicTableHeader } from "@/content/shared/ui/dinamicTable/components/dinamicTableHeader/DinamicTableHeader";
import { DinamicTh } from "@/content/shared/ui/dinamicTable/components/dinamicTh/DinamicTh";
import { DinamicTable } from "@/content/shared/ui/dinamicTable/DinamicTable";
import { ModalBodyMembersFilter } from "../modalBodyMembersFilter/ModalBodyMembersFilter";
import { MemberRow } from "./components/memberRow/MemberRow";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { ModalBodyTransferOrganization } from "../modalBodyTransferOrganization/ModalBodyTransferOrganizationForm";
import { ModalBodyInviteMemberForm } from "../modalBodyInviteMember/ModalBodyInviteMemberForm";

/* DATA */
import { membersColumns } from "./data/membersColumns";

/* HOOKS */
import { useState, useEffect } from "react";

/* ICONS */
import {
  ArrowLeftRight,
  Ellipsis,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";
import { useMembersFilter } from "./stores/membersStore";

/* TYPES */
import { MemberType } from "./types/memberType";

/* UTILS */
import { getTwBgColorTable } from "@/content/shared/ui/dinamicTable/utils/getTwBgColorTable";
import { generatePagination } from "@/content/shared/ui/dinamicTable/utils/generatePagination";

export function OrganizationMembersTable() {
  const { setAnnouncement } = useAnnouncement();
  const { setModal } = useModal();

  const [members, setMembers] = useState<{
    data: MemberType[];
    count: number;
  }>({
    data: [],
    count: 0,
  });
  const [loading, setLoading] = useState(true);

  const {
    filter = {
      page: 0,
      perPage: 25,
      order: "desc",
      orderBy: "id",
    },
    setFilter,
  } = useMembersFilter();

  /* DinamicHeader */
  const filterAction = () =>
    setModal({
      isActivated: true,
      title: "Filtrar miembros",
      body: <ModalBodyMembersFilter />,
    });

  /* DinamicBody */
  const nextPage = () => {
    if (!filter) return;
    const totalPages = Math.ceil(members.count / filter.perPage);
    if (filter.page + 1 < totalPages) {
      setFilter({ ...filter, page: filter.page + 1 });
    }
  };

  const prevPage = () => {
    if (!filter || filter.page === 0) return;
    setFilter({ ...filter, page: filter.page - 1 });
  };

  const hasNextPage =
    filter && (filter.page + 1) * filter.perPage < members.count;
  const totalPages = filter ? Math.ceil(members.count / filter.perPage) : 1;

  /* DinamicFooter */
  const type = "miembro";
  const currentPage = filter?.page === undefined ? 0 : filter.page;
  const items = generatePagination(currentPage, totalPages);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!filter) return;

      try {
        setLoading(true);

        setTimeout(() => {
          setMembers({
            data: [
              {
                id: 1,
                name: "Nombre 1",
                lastname: "Apellido 1",
                email: "nombre1@gmail.com",
                phone: "+52 631 111 1111",
                role: "viewer",
                slug: "M1",
                status: "active",
              },
              {
                id: 2,
                name: "Nombre 2",
                lastname: "Apellido 2",
                email: "nombre2@gmail.com",
                phone: "+52 631 111 1112",
                role: "viewer",
                slug: "M2",
                status: "inactive",
              },
              {
                id: 3,
                name: "Nombre 3",
                lastname: "Apellido 3",
                email: "nombre3@gmail.com",
                phone: "+52 631 111 1113",
                role: "viewer",
                slug: "M3",
                status: "active",
              },
              {
                id: 4,
                name: "Nombre 4",
                lastname: "Apellido 4",
                email: "nombre4@gmail.com",
                phone: "+52 631 111 1114",
                role: "viewer",
                slug: "M4",
                status: "active",
              },
              {
                id: 5,
                name: "Nombre 5",
                lastname: "Apellido 5",
                email: "nombre5@gmail.com",
                phone: "+52 631 111 1115",
                role: "viewer",
                slug: "M5",
                status: "active",
              },
              {
                id: 6,
                name: "Nombre 6",
                lastname: "Apellido 6",
                email: "nombre6@gmail.com",
                phone: "+52 631 111 1116",
                role: "viewer",
                slug: "M6",
                status: "active",
              },
              {
                id: 7,
                name: "Nombre 7",
                lastname: "Apellido 7",
                email: "nombre7@gmail.com",
                phone: "+52 631 111 1117",
                role: "viewer",
                slug: "M7",
                status: "active",
              },
              {
                id: 8,
                name: "Nombre 8",
                lastname: "Apellido 8",
                email: "nombre8@gmail.com",
                phone: "+52 631 111 1118",
                role: "viewer",
                slug: "M8",
                status: "active",
              },
              {
                id: 9,
                name: "Nombre 9",
                lastname: "Apellido 9",
                email: "nombre9@gmail.com",
                phone: "+52 631 111 1119",
                role: "viewer",
                slug: "M9",
                status: "active",
              },
              {
                id: 10,
                name: "Nombre 10",
                lastname: "Apellido 10",
                email: "nombre10@gmail.com",
                phone: "+52 631 111 1120",
                role: "viewer",
                slug: "M10",
                status: "active",
              },
              {
                id: 11,
                name: "Nombre 11",
                lastname: "Apellido 11",
                email: "nombre11@gmail.com",
                phone: "+52 631 111 1121",
                role: "viewer",
                slug: "M11",
                status: "active",
              },
              {
                id: 12,
                name: "Nombre 12",
                lastname: "Apellido 12",
                email: "nombre12@gmail.com",
                phone: "+52 631 111 1122",
                role: "viewer",
                slug: "M12",
                status: "active",
              },
            ],
            count: 12,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        setLoading(false);
        setMembers({ data: [], count: 0 });
        console.log("Hubo un error al obtener los miembros:", error);
        setAnnouncement({
          isActivated: true,
          announceType: "error",
          message:
            "Hubo un error al obtener los miembros, intente nuevamente más tarde",
        });
      }
    };

    fetchMembers();
  }, [filter, setAnnouncement]);

  return (
    <div className="w-full flex-1 min-h-0 rounded-2xl border border-line flex flex-col">
      <DinamicTable>
        {/* HEADER */}
        <DinamicTableHeader>
          <div className="border-b border-line flex items-center justify-between w-full p-6 h-fit">
            <p className="text-xl font-extralight text-ink">Miembros</p>

            <div className="flex gap-4 items-center">
              <DinamicButton
                action={() =>
                  setModal({
                    isActivated: true,
                    title: "Invitar miembro",
                    body: <ModalBodyInviteMemberForm slug="" />,
                  })
                }
                type="filled"
                label="Invitar"
                icon={<Plus className="size-4 min-w-4 min-h-4" />}
                twClassName="text-sm w-fit py-1"
              />
              <DinamicButton
                action={filterAction}
                type="filled"
                label="Filtrar"
                icon={<SlidersHorizontal className="size-4 min-w-4 min-h-4" />}
                twClassName="text-sm w-fit py-1"
              />
              <DinamicButton
                action={() =>
                  setModal({
                    isActivated: true,
                    title: "Transferir organización",
                    body: <ModalBodyTransferOrganization />,
                  })
                }
                type="destructive"
                label="Transferir"
                icon={<ArrowLeftRight className="size-4 min-w-4 min-h-4" />}
                twClassName="text-sm w-fit py-1"
              />
            </div>
          </div>
        </DinamicTableHeader>

        {/* BODY */}
        <DinamicTableBody
          theadColumns={membersColumns.map((column, index) => (
            <DinamicTh key={index} column={column} />
          ))}
          tbodyRows={members.data.map((member, index) => (
            <MemberRow
              key={index}
              member={member}
              twBgColor={getTwBgColorTable({ index })}
            />
          ))}
          loading={loading}
          count={members.count}
          type={type}
        />

        {/* FOOTER */}
        <DinamicTableFooter
          loading={loading}
          count={members.count}
          type={type}
          actualPage={(filter?.page ?? 0) + 1}
          totalPages={totalPages > 0 ? totalPages : 1}
          goBackAction={prevPage}
          goNextAction={nextPage}
          goNext={hasNextPage ?? false}
          goBack={filter?.page !== 0}
          paginationContent={items.map((item, index) => {
            if (item === "...") {
              return (
                <div key={index} className="flex items-center">
                  <Ellipsis className="size-4 min-w-4 min-h-4" />
                </div>
              );
            }

            const isActive = item === currentPage;

            return (
              <DinamicButton
                key={index}
                action={() => {
                  if (filter?.page !== item - 1) {
                    setFilter({
                      page: item - 1,
                      perPage: filter?.perPage ?? 10,
                      order: filter?.order ?? "asc",
                      orderBy: filter?.orderBy ?? "id",
                    });
                  }
                }}
                type={isActive ? "filled" : "ghost"}
                twClassName="w-fit py-1 px-2 text-sm"
                label={item.toString()}
              />
            );
          })}
        />
      </DinamicTable>
    </div>
  );
}
