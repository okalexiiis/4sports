'use client'

/* COMPONENTS */
import { DinamicTableBody } from '@/content/shared/ui/dinamicTable/components/dinamicTableBody/DinamicTableBody'
import { DinamicTableFooter } from '@/content/shared/ui/dinamicTable/components/dinamicTableFooter/DinamicTableFooter'
import { DinamicTableHeader } from '@/content/shared/ui/dinamicTable/components/dinamicTableHeader/DinamicTableHeader'
import { DinamicTh } from '@/content/shared/ui/dinamicTable/components/dinamicTh/DinamicTh'
import { DinamicTable } from '@/content/shared/ui/dinamicTable/DinamicTable'
import { ModalBodyMembersFilter } from '../modalBodyMembersFilter/ModalBodyMembersFilter'
import { MemberRow } from './components/memberRow/MemberRow'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { ModalBodyTransferOrganization } from '../modalBodyTransferOrganization/ModalBodyTransferOrganizationForm'
import { ModalBodyInviteMemberForm } from '../modalBodyInviteMember/ModalBodyInviteMemberForm'

/* CONSTS */
import { PORT } from '@/content/shared/consts/PORT'

/* DATA */
import { membersColumns } from './data/membersColumns'

/* HOOKS */
import { useState, useEffect } from 'react'

/* ICONS */
import { ArrowLeftRight, Ellipsis, Plus, SlidersHorizontal } from 'lucide-react'

/* STORES */
import { useAnnouncement } from '@/content/shared/ui/annoucement/stores/announcementStore'
import { useModal } from '@/content/shared/ui/modal/stores/modalStore'
import { useMembersFilter } from './stores/membersStore'
import { useOrganizationStore } from '@/content/dashboard/organizer/organizations/page/stores/organizationStore/organizationStore'

/* TYPES */
import { OrgMember } from '../../../../../../../../../api/src/modules/organizations/organization.entity'

/* UTILS */
import { getTwBgColorTable } from '@/content/shared/ui/dinamicTable/utils/getTwBgColorTable'
import { generatePagination } from '@/content/shared/ui/dinamicTable/utils/generatePagination'

export function OrganizationMembersTable() {
  const { setAnnouncement } = useAnnouncement()
  const { setModal } = useModal()
  const organization = useOrganizationStore((s) => s.organization)

  const [members, setMembers] = useState<{
    data: OrgMember[]
    count: number
  }>({
    data: [],
    count: 0,
  })
  const [loading, setLoading] = useState(true)

  const {
    filter = {
      page: 0,
      perPage: 10,
    },
    setFilter,
  } = useMembersFilter()

  /* DinamicHeader */
  const filterAction = () =>
    setModal({
      isActivated: true,
      title: 'Filtrar miembros',
      body: <ModalBodyMembersFilter />,
    })

  /* DinamicBody */
  const nextPage = () => {
    if (!filter) return
    const totalPages = Math.ceil(members.count / filter.perPage)
    if (filter.page + 1 < totalPages) {
      setFilter({ ...filter, page: filter.page + 1 })
    }
  }

  const prevPage = () => {
    if (!filter || filter.page === 0) return
    setFilter({ ...filter, page: filter.page - 1 })
  }

  const hasNextPage = filter && (filter.page + 1) * filter.perPage < members.count
  const totalPages = filter ? Math.ceil(members.count / filter.perPage) : 1

  /* DinamicFooter */
  const type = 'miembro'
  const currentPage = filter?.page === undefined ? 0 : filter.page
  const items = generatePagination(currentPage, totalPages)

  useEffect(() => {
    const fetchMembers = async () => {
      if (!filter) return

      try {
        setLoading(true)

        const page = (filter?.page ?? 0) + 1

        const request = await fetch(
          PORT +
            `/v1/organizations/${organization?.id ?? 'error'}/members?page=${page}&limit=${filter?.perPage ?? '10'}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          },
        )

        if (request.status === 200) {
          const response = await request.json()
          setMembers({
            data: response.data.members,
            count: response.data.meta.total,
          })
          setLoading(false)
        } else {
          setLoading(false)
          setMembers({ data: [], count: 0 })
        }
      } catch (error) {
        setLoading(false)
        console.log(error)
        setMembers({ data: [], count: 0 })
      }
    }

    fetchMembers()
  }, [filter, setAnnouncement, organization])

  return (
    <div className="flex flex-col flex-1 w-full min-h-0">
      <DinamicTable>
        {/* HEADER */}
        <DinamicTableHeader>
          <div className="flex items-center justify-between w-full p-6 border-b border-b-line h-fit">
            <p className="text-xl font-extralight text-ink">Miembros</p>

            <div className="flex items-center gap-4">
              <DinamicButton
                action={() =>
                  setModal({
                    isActivated: true,
                    title: 'Invitar miembro',
                    body: <ModalBodyInviteMemberForm slug="" />,
                  })
                }
                type="filled"
                label="Invitar"
                icon={<Plus className="size-4 min-w-4 min-h-4" />}
                twClassName="text-sm w-fit py-1"
              />
              {/* <DinamicButton
                action={filterAction}
                type="filled"
                label="Filtrar"
                icon={<SlidersHorizontal className="size-4 min-w-4 min-h-4" />}
                twClassName="text-sm w-fit py-1"
              /> */}
              {/* <DinamicButton
                action={() =>
                  setModal({
                    isActivated: true,
                    title: 'Transferir organización',
                    body: <ModalBodyTransferOrganization />,
                  })
                }
                type="destructive"
                label="Transferir"
                icon={<ArrowLeftRight className="size-4 min-w-4 min-h-4" />}
                twClassName="text-sm w-fit py-1"
              /> */}
            </div>
          </div>
        </DinamicTableHeader>

        {/* BODY */}
        <DinamicTableBody
          theadColumns={membersColumns.map((column, index) => (
            <DinamicTh key={index} column={column} />
          ))}
          tbodyRows={members.data.map((member, index) => (
            <MemberRow key={index} member={member} twBgColor={getTwBgColorTable({ index })} />
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
            if (item === '...') {
              return (
                <div key={index} className="flex items-center">
                  <Ellipsis className="size-4 min-w-4 min-h-4" />
                </div>
              )
            }

            const isActive = item === currentPage + 1

            return (
              <DinamicButton
                key={index}
                action={() => {
                  if (filter?.page !== item - 1) {
                    setFilter({
                      page: item - 1,
                      perPage: filter?.perPage ?? 10,
                    })
                  }
                }}
                type={isActive ? 'filled' : 'ghost'}
                twClassName="w-fit py-1 px-2 text-sm"
                label={item.toString()}
              />
            )
          })}
        />
      </DinamicTable>
    </div>
  )
}
