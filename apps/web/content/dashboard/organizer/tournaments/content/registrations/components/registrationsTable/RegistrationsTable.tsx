"use client";

/* COMPONENTS */
import { DinamicTableBody } from "@/content/shared/ui/dinamicTable/components/dinamicTableBody/DinamicTableBody";
import { DinamicTableFooter } from "@/content/shared/ui/dinamicTable/components/dinamicTableFooter/DinamicTableFooter";
import { DinamicTableHeader } from "@/content/shared/ui/dinamicTable/components/dinamicTableHeader/DinamicTableHeader";
import { DinamicTh } from "@/content/shared/ui/dinamicTable/components/dinamicTh/DinamicTh";
import { DinamicTable } from "@/content/shared/ui/dinamicTable/DinamicTable";
import { RegistrationRow } from "./components/registrationRow/RegistrationRow";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { ModalBodyRegistrationsFilter } from "../modalBodyRegistrationsFilter/ModalBodyRegistrationsFilter";

/* DATA */
import { registrationsColumns } from "./data/registrationsColumns";

/* HOOKS */
import { useState, useEffect } from "react";

/* ICONS */
import { Ellipsis, SlidersHorizontal } from "lucide-react";

/* IMAGES */
import team1 from "./images/team1.jpg";
import team2 from "./images/team2.jpg";
import team3 from "./images/team3.jpg";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";
import { useRegistrationsFilter } from "./stores/registrationsStore";

/* TYPES */
import { RegistrationType } from "./types/registrationType";

/* UTILS */
import { getTwBgColorTable } from "@/content/shared/ui/dinamicTable/utils/getTwBgColorTable";
import { generatePagination } from "@/content/shared/ui/dinamicTable/utils/generatePagination";

export function RegistrationsTable() {
  const { setAnnouncement } = useAnnouncement();
  const { setModal } = useModal();

  const [registrations, setRegistrations] = useState<{
    data: RegistrationType[];
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
      orderBy: "date",
    },
    setFilter,
  } = useRegistrationsFilter();

  /* DinamicHeader */
  const filterAction = () =>
    setModal({
      isActivated: true,
      title: "Filtrar solicitudes",
      body: <ModalBodyRegistrationsFilter />,
    });

  /* DinamicBody */
  const nextPage = () => {
    if (!filter) return;
    const totalPages = Math.ceil(registrations.count / filter.perPage);
    if (filter.page + 1 < totalPages) {
      setFilter({ ...filter, page: filter.page + 1 });
    }
  };

  const prevPage = () => {
    if (!filter || filter.page === 0) return;
    setFilter({ ...filter, page: filter.page - 1 });
  };

  const hasNextPage =
    filter && (filter.page + 1) * filter.perPage < registrations.count;
  const totalPages = filter
    ? Math.ceil(registrations.count / filter.perPage)
    : 1;

  /* DinamicFooter */
  const currentPage = filter?.page === undefined ? 0 : filter.page;
  const items = generatePagination(currentPage, totalPages);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!filter) return;

      try {
        setLoading(true);

        setTimeout(() => {
          setRegistrations({
            data: [
              {
                id: "1",
                teamPhoto: team1,
                teamName: "Los Grandes",
                date: "2026-02-02",
              },
              {
                id: "2",
                teamPhoto: team2,
                teamName: "Águilas",
                date: "2026-02-06",
              },
              {
                id: "3",
                teamPhoto: team3,
                teamName: "Toros Negros",
                date: "2026-02-02",
              },
            ],
            count: 3,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        setLoading(false);
        setRegistrations({ data: [], count: 0 });
        console.log("Hubo un error al obtener las solicitudes:", error);
        setAnnouncement({
          isActivated: true,
          announceType: "error",
          message:
            "Hubo un error al obtener las solicitudes, intente nuevamente más tarde",
        });
      }
    };

    fetchRegistrations();
  }, [filter, setAnnouncement]);

  return (
    <div className="w-full flex-1 min-h-0 rounded-2xl border border-line flex flex-col">
      <DinamicTable>
        {/* HEADER */}
        <DinamicTableHeader>
          <div className="border-b border-line flex items-center justify-between w-full p-6 h-fit">
            <p className="text-xl font-extralight text-ink">Solicitudes</p>

            <div className="flex gap-4 items-center">
              <DinamicButton
                action={filterAction}
                type="filled"
                label="Filtrar"
                icon={<SlidersHorizontal className="size-4 min-w-4 min-h-4" />}
                twClassName="text-sm w-fit py-1"
              />
            </div>
          </div>
        </DinamicTableHeader>

        {/* BODY */}
        <DinamicTableBody
          theadColumns={registrationsColumns.map((column, index) => (
            <DinamicTh key={index} column={column} />
          ))}
          tbodyRows={registrations.data.map((registration, index) => (
            <RegistrationRow
              key={index}
              registration={registration}
              twBgColor={getTwBgColorTable({ index })}
            />
          ))}
          loading={loading}
          count={registrations.count}
          type={"solicitude"}
        />

        {/* FOOTER */}
        <DinamicTableFooter
          loading={loading}
          count={registrations.count}
          type={
            registrations.count >= 1 || registrations.count === 0
              ? "solicitude"
              : "solicitud"
          }
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
                      orderBy: filter?.orderBy ?? "date",
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
