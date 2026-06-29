"use client";

/* COMPONENTS */
import { DinamicTableBody } from "@/content/shared/ui/dinamicTable/components/dinamicTableBody/DinamicTableBody";
import { DinamicTableFooter } from "@/content/shared/ui/dinamicTable/components/dinamicTableFooter/DinamicTableFooter";
import { DinamicTableHeader } from "@/content/shared/ui/dinamicTable/components/dinamicTableHeader/DinamicTableHeader";
import { DinamicTh } from "@/content/shared/ui/dinamicTable/components/dinamicTh/DinamicTh";
import { DinamicTable } from "@/content/shared/ui/dinamicTable/DinamicTable";
import { TeamRow } from "./components/teamRow/TeamRow";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { ModalBodyTeamsFilter } from "../modalBodyTeamsFilter/ModalBodyTeamsFilter";

/* DATA */
import { teamsColumns } from "./data/teamsColumns";

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
import { useTeamsFilter } from "./stores/teamsStore";
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { TeamType } from "./types/teamType";

/* UTILS */
import { getTwBgColorTable } from "@/content/shared/ui/dinamicTable/utils/getTwBgColorTable";
import { generatePagination } from "@/content/shared/ui/dinamicTable/utils/generatePagination";

export function TeamsTable() {
  const { setAnnouncement } = useAnnouncement();
  const { setModal } = useModal();

  const [teams, setTeams] = useState<{
    data: TeamType[];
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
      orderBy: "teamName",
    },
    setFilter,
  } = useTeamsFilter();

  /* DinamicBody */
  const nextPage = () => {
    if (!filter) return;
    const totalPages = Math.ceil(teams.count / filter.perPage);
    if (filter.page + 1 < totalPages) {
      setFilter({ ...filter, page: filter.page + 1 });
    }
  };

  const prevPage = () => {
    if (!filter || filter.page === 0) return;
    setFilter({ ...filter, page: filter.page - 1 });
  };

  const hasNextPage =
    filter && (filter.page + 1) * filter.perPage < teams.count;
  const totalPages = filter ? Math.ceil(teams.count / filter.perPage) : 1;

  /* DinamicFooter */
  const currentPage = filter?.page === undefined ? 0 : filter.page;
  const items = generatePagination(currentPage, totalPages);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!filter) return;

      try {
        setLoading(true);

        setTimeout(() => {
          setTeams({
            data: [
              {
                teamPhoto: team1,
                teamName: "Los Grandes",
                players: 9,
              },
              {
                teamPhoto: team2,
                teamName: "Águilas",
                players: 13,
              },
              {
                teamPhoto: team3,
                teamName: "Toros Negros",
                players: 10,
              },
            ],
            count: 3,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        setLoading(false);
        setTeams({ data: [], count: 0 });
        console.log("Hubo un error al obtener los equipos:", error);
        setAnnouncement({
          isActivated: true,
          announceType: "error",
          message:
            "Hubo un error al obtener los equipos, intente nuevamente más tarde",
        });
      }
    };

    fetchTeams();
  }, [filter, setAnnouncement]);

  return (
    <div className="w-full flex-1 min-h-0 rounded-2xl border border-line flex flex-col">
      <DinamicTable>
        {/* HEADER */}
        <DinamicTableHeader>
          <div className="border-b border-line flex items-center justify-between w-full p-6 h-fit">
            <p className="text-xl font-extralight text-ink">Equipos</p>

            <DinamicButton
              action={() =>
                setModal({
                  isActivated: true,
                  title: "Filtrar",
                  body: <ModalBodyTeamsFilter />,
                })
              }
              type="filled"
              label="Filtrar"
              twClassName="w-fit py-1 text-sm"
              icon={<SlidersHorizontal className="size-4 min-w-4 min-h-4" />}
            />
          </div>
        </DinamicTableHeader>

        {/* BODY */}
        <DinamicTableBody
          theadColumns={teamsColumns.map((column, index) => (
            <DinamicTh key={index} column={column} />
          ))}
          tbodyRows={teams.data.map((team, index) => (
            <TeamRow
              key={index}
              team={team}
              twBgColor={getTwBgColorTable({ index })}
            />
          ))}
          loading={loading}
          count={teams.count}
          type={"equipo"}
        />

        {/* FOOTER */}
        <DinamicTableFooter
          loading={loading}
          count={teams.count}
          type={"equipo"}
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
                      orderBy: filter?.orderBy ?? "teamName",
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
