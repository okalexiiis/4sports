"use client";

/* COMPONENTS */
import { DinamicTableBody } from "@/content/shared/ui/dinamicTable/components/dinamicTableBody/DinamicTableBody";
import { DinamicTableFooter } from "@/content/shared/ui/dinamicTable/components/dinamicTableFooter/DinamicTableFooter";
import { DinamicTableHeader } from "@/content/shared/ui/dinamicTable/components/dinamicTableHeader/DinamicTableHeader";
import { DinamicTh } from "@/content/shared/ui/dinamicTable/components/dinamicTh/DinamicTh";
import { DinamicTable } from "@/content/shared/ui/dinamicTable/DinamicTable";
import { RegistrationRow } from "./components/positionRow/PositionRow";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

/* DATA */
import { positionsColumns } from "./data/positionsColumns";

/* HOOKS */
import { useState, useEffect } from "react";

/* ICONS */
import { Ellipsis } from "lucide-react";

/* IMAGES */
import team1 from "./images/team1.jpg";
import team2 from "./images/team2.jpg";
import team3 from "./images/team3.jpg";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";
import { usePositionsFilter } from "./stores/positionsStore";

/* TYPES */
import { PositionType } from "./types/positionType";

/* UTILS */
import { getTwBgColorTable } from "@/content/shared/ui/dinamicTable/utils/getTwBgColorTable";
import { generatePagination } from "@/content/shared/ui/dinamicTable/utils/generatePagination";

export function PositionsTable() {
  const { setAnnouncement } = useAnnouncement();

  const [positions, setPositions] = useState<{
    data: PositionType[];
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
      orderBy: "pts",
    },
    setFilter,
  } = usePositionsFilter();

  /* DinamicBody */
  const nextPage = () => {
    if (!filter) return;
    const totalPages = Math.ceil(positions.count / filter.perPage);
    if (filter.page + 1 < totalPages) {
      setFilter({ ...filter, page: filter.page + 1 });
    }
  };

  const prevPage = () => {
    if (!filter || filter.page === 0) return;
    setFilter({ ...filter, page: filter.page - 1 });
  };

  const hasNextPage =
    filter && (filter.page + 1) * filter.perPage < positions.count;
  const totalPages = filter ? Math.ceil(positions.count / filter.perPage) : 1;

  /* DinamicFooter */
  const currentPage = filter?.page === undefined ? 0 : filter.page;
  const items = generatePagination(currentPage, totalPages);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!filter) return;

      try {
        setLoading(true);

        setTimeout(() => {
          setPositions({
            data: [
              {
                teamPhoto: team1,
                teamName: "Los Grandes",
                pj: "0",
                pg: "0",
                pe: "0",
                pp: "0",
                gf: "0",
                gc: "0",
                dg: "0",
                pts: "0",
              },
              {
                teamPhoto: team2,
                teamName: "Águilas",
                pj: "0",
                pg: "0",
                pe: "0",
                pp: "0",
                gf: "0",
                gc: "0",
                dg: "0",
                pts: "0",
              },
              {
                teamPhoto: team3,
                teamName: "Toros Negros",
                pj: "0",
                pg: "0",
                pe: "0",
                pp: "0",
                gf: "0",
                gc: "0",
                dg: "0",
                pts: "0",
              },
            ],
            count: 3,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        setLoading(false);
        setPositions({ data: [], count: 0 });
        console.log("Hubo un error al obtener las posiciones:", error);
        setAnnouncement({
          isActivated: true,
          announceType: "error",
          message:
            "Hubo un error al obtener las posiciones, intente nuevamente más tarde",
        });
      }
    };

    fetchPositions();
  }, [filter, setAnnouncement]);

  return (
    <div className="w-full flex-1 min-h-0 rounded-2xl border border-line flex flex-col">
      <DinamicTable>
        {/* HEADER */}
        <DinamicTableHeader>
          <div className="border-b border-line flex items-center justify-between w-full p-6 h-fit">
            <p className="text-xl font-extralight text-ink">Posiciones</p>
          </div>
        </DinamicTableHeader>

        {/* BODY */}
        <DinamicTableBody
          theadColumns={positionsColumns.map((column, index) => (
            <DinamicTh key={index} column={column} />
          ))}
          tbodyRows={positions.data.map((position, index) => (
            <RegistrationRow
              key={index}
              position={position}
              twBgColor={getTwBgColorTable({ index })}
              positionNumber={index + 1}
            />
          ))}
          loading={loading}
          count={positions.count}
          type={"poicione"}
        />

        {/* FOOTER */}
        <DinamicTableFooter
          loading={loading}
          count={positions.count}
          type={
            positions.count >= 1 || positions.count === 0
              ? "poicione"
              : "posición"
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
                      orderBy: filter?.orderBy ?? "pts",
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
