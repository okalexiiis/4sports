'use client'

/* COMPONENTS */
import { SectionContainer } from '@/content/shared/ui/sectionContainer/SectionContainer'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { TournamentCard } from './components/tournamentCard/TournamentCard'

/* ICONS */
import { Plus, Image as Photo } from 'lucide-react'

/* IMAGES */
import tournament1 from './images/tournament1.png'
import tournament2 from './images/tournament2.png'
import tournament3 from './images/tournament3.png'
import team1 from './images/team1.jpg'
import team2 from './images/team2.jpg'
import team3 from './images/team3.jpg'
import team4 from './images/team4.jpg'
import banner1 from './images/banner1.jpg'
import banner2 from './images/banner2.jpg'
import organization1 from './images/organization1.png'

/* NAVIGATION */
import { useRouter } from 'next/navigation'

/* STORES */
import { useOrganizationStore } from '@/content/dashboard/organizer/organizations/page/stores/organizationStore/organizationStore'

/* TYPES */
import { TournamentCardType } from './components/tournamentCard/types/TournamentCardType'
import Image from 'next/image'

const tournaments: TournamentCardType[] = [
  {
    slug: 'torneo-verano-ii',
    name: 'Torneo Verano II',
    description: 'Pre Elecciones de Verano II',
    image: tournament1,
    state: 'Inscribiendo',
    sex: 'Femenino',
    sport: 'Básquetbol',
    teams: [{ image: team1 }, { image: team2 }, { image: team3 }, { image: team4 }],
    teamsQuantity: 20,
    type: 'Eliminatoria directa',
    banner: banner1,
    location: 'Nogales, Sonora. México',
  },
  {
    slug: 'casa-de-plata',
    name: 'Casa de Plata',
    description: 'Reuniendo los mejores equipos 2026',
    image: tournament2,
    state: 'Jugando',
    sex: 'Femenino',
    sport: 'Básquetbol',
    teams: [{ image: team1 }, { image: team2 }, { image: team3 }, { image: team4 }],
    teamsQuantity: 9,
    type: 'Todos contra todos',
    banner: banner2,
    location: 'Nogales, Sonora. México',
  },
  {
    slug: 'tronos',
    name: 'Tronos',
    description: 'Práctica de equipos Nogalenses',
    image: tournament3,
    state: 'Finalizado',
    sex: 'Femenino',
    sport: 'Básquetbol',
    teams: [{ image: team1 }, { image: team2 }, { image: team3 }],
    teamsQuantity: 3,
    type: 'Eliminatoria directa',
    banner: banner1,
    location: 'Nogales, Sonora. México',
  },
]

export function OrganizerTournamentsContent() {
  const router = useRouter()

  const organization = useOrganizationStore((s) => s.organization)

  return (
    <SectionContainer>
      <div className="flex flex-col p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-5xl font-bebas text-ink">
            Mis <span className="text-primary">Torneos</span>
          </p>

          <DinamicButton
            action={() => router.push('/organizer/tournaments/add')}
            twClassName="w-fit py-1 text-sm"
            disabled={false}
            disabledSpinner={false}
            type={'filled'}
            label="Nuevo torneo"
            spinFromText
            icon={<Plus className="size-4 min-h-4 min-w-4" />}
          />
        </div>

        <div className="flex items-center w-full gap-4 mb-6">
          <p className="text-xl font-extralight">Gestionado torneos de la organización:</p>

          <div className="flex items-center gap-3">
            {organization?.logo_url !== null &&
            organization?.logo_url !== '' &&
            organization?.logo_url ? (
              <div className='relative w-8 h-8 min-h-8 min-w-8'>
                <Image
                  alt="Organización"
                  src={organization.logo_url}
                  quality={70}
                  fill
                  className="object-cover object-center border rounded-lg border-line"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-8 h-8 border rounded-lg bg-surface min-w-8 min-h-8 border-line">
                <Photo className="size-4 min-h-4 min-w-4" />
              </div>
            )}

            <p className="text-xl font-medium text-ink">{organization?.name ?? '...'}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <TournamentCard
              key={t.slug}
              slug={t.slug}
              name={t.name}
              description={t.description}
              image={t.image}
              state={t.state}
              sex={t.sex}
              sport={t.sport}
              teams={t.teams}
              teamsQuantity={t.teamsQuantity}
              type={t.type}
              banner={t.banner}
              location={t.location}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}
