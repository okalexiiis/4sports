"use client";

/* COMPONENTS */
import { DinamicTableBody } from "@/content/shared/ui/dinamicTable/components/dinamicTableBody/DinamicTableBody";
import { DinamicTableFooter } from "@/content/shared/ui/dinamicTable/components/dinamicTableFooter/DinamicTableFooter";
import { DinamicTableHeader } from "@/content/shared/ui/dinamicTable/components/dinamicTableHeader/DinamicTableHeader";
import { DinamicTh } from "@/content/shared/ui/dinamicTable/components/dinamicTh/DinamicTh";
import { DinamicTable } from "@/content/shared/ui/dinamicTable/DinamicTable";
import { ModalBodyPaymentsFilter } from "./components/modalBodyPaymentsFilter/ModalBodyPaymentsFilter";
import { PaymentRow } from "./components/paymentRow/PaymentRow";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

/* DATA */
import { paymentsColumns } from "./data/paymentsColumns";

/* HOOKS */
import { useState, useEffect } from "react";

/* ICONS */
import { Ellipsis, SlidersHorizontal } from "lucide-react";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";
import { usePaymentsFilter } from "./stores/paymentsStore";

/* TYPES */
import { PaymentsType } from "./types/paymentsType";

/* UTILS */
import { getTwBgColorTable } from "@/content/shared/ui/dinamicTable/utils/getTwBgColorTable";
import { generatePagination } from "@/content/shared/ui/dinamicTable/utils/generatePagination";

export function OrganizationPaymentHistoryTable() {
  const { setAnnouncement } = useAnnouncement();
  const { setModal } = useModal();

  const [payments, setPayments] = useState<{
    data: PaymentsType[];
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
  } = usePaymentsFilter();

  /* DinamicHeader */
  const filterAction = () =>
    setModal({
      isActivated: true,
      title: "Filtrar pagos",
      body: <ModalBodyPaymentsFilter />,
    });

  /* DinamicBody */
  const nextPage = () => {
    if (!filter) return;
    const totalPages = Math.ceil(payments.count / filter.perPage);
    if (filter.page + 1 < totalPages) {
      setFilter({ ...filter, page: filter.page + 1 });
    }
  };

  const prevPage = () => {
    if (!filter || filter.page === 0) return;
    setFilter({ ...filter, page: filter.page - 1 });
  };

  const hasNextPage =
    filter && (filter.page + 1) * filter.perPage < payments.count;
  const totalPages = filter ? Math.ceil(payments.count / filter.perPage) : 1;

  /* DinamicFooter */
  const type = "pago";
  const currentPage = filter?.page === undefined ? 0 : filter.page;
  const items = generatePagination(currentPage, totalPages);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!filter) return;

      try {
        setLoading(true);

        setTimeout(() => {
          setPayments({
            data: [
              {
                id: 1,
                total: 299,
                plan: "starter",
                date: "2025-01-01",
              },
              {
                id: 2,
                total: 299,
                plan: "starter",
                date: "2025-02-01",
              },
              {
                id: 3,
                total: 299,
                plan: "starter",
                date: "2025-03-01",
              },
              {
                id: 3,
                total: 299,
                plan: "starter",
                date: "2025-04-01",
              },
              {
                id: 4,
                total: 299,
                plan: "starter",
                date: "2025-05-01",
              },
              {
                id: 5,
                total: 299,
                plan: "starter",
                date: "2025-06-01",
              },
              {
                id: 6,
                total: 299,
                plan: "starter",
                date: "2025-07-01",
              },
              {
                id: 7,
                total: 299,
                plan: "starter",
                date: "2025-08-01",
              },
              {
                id: 8,
                total: 299,
                plan: "starter",
                date: "2025-09-01",
              },
              {
                id: 10,
                total: 299,
                plan: "starter",
                date: "2025-10-01",
              },
              {
                id: 11,
                total: 299,
                plan: "starter",
                date: "2025-11-01",
              },
              {
                id: 12,
                total: 299,
                plan: "starter",
                date: "2025-12-01",
              },
            ],
            count: 12,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        setLoading(false);
        setPayments({ data: [], count: 0 });
        console.log("Hubo un error al obtener los pagos:", error);
        setAnnouncement({
          isActivated: true,
          announceType: "error",
          message:
            "Hubo un error al obtener los pagos, intente nuevamente más tarde",
        });
      }
    };

    fetchPayments();
  }, [filter, setAnnouncement]);

  return (
    <div className="w-full flex-1 min-h-0 rounded-2xl border border-line flex flex-col">
      <DinamicTable>
        {/* HEADER */}
        <DinamicTableHeader>
          <div className="border-b border-line flex items-center justify-between w-full p-6 h-fit">
            <p className="text-xl font-extralight text-ink">
              Historial de pagos
            </p>

            <DinamicButton
              action={filterAction}
              type="filled"
              label="Filtrar"
              icon={<SlidersHorizontal className="size-4 min-w-4 min-h-4" />}
              twClassName="text-sm w-fit py-1"
            />
          </div>
        </DinamicTableHeader>

        {/* BODY */}
        <DinamicTableBody
          theadColumns={paymentsColumns.map((column, index) => (
            <DinamicTh key={index} column={column} />
          ))}
          tbodyRows={payments.data.map((payment, index) => (
            <PaymentRow
              key={index}
              payment={payment}
              twBgColor={getTwBgColorTable({ index })}
            />
          ))}
          loading={loading}
          count={payments.count}
          type={type}
        />

        {/* FOOTER */}
        <DinamicTableFooter
          loading={loading}
          count={payments.count}
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
