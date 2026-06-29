/* COMPONENTS */
import { SectionContainer } from "@/content/shared/ui/sectionContainer/SectionContainer";
import { MatchCard } from "./components/matchCard/MatchCard";

/* IMAGES */
import team1 from "./images/team1.jpg";
import team2 from "./images/team2.jpg";
import team3 from "./images/team3.jpg";
import team4 from "./images/team4.jpg";
import team5 from "./images/team5.jpg";
import team6 from "./images/team6.jpg";
import tournament1 from "./images/tournament1.png";

/* TYPES */
import { MatchCardType } from "./components/matchCard/types/matchCardType";

const matches: MatchCardType[] = [
  {
    team1Img: team1,
    team1Name: "Danzantes",
    team2Img: team2,
    team2Name: "Las Avispas",
    hora: "6:00 PM",
    cancha: "La Vista",
    tournament: "Torneo Verano II",
    tournament_image: tournament1,
    tournament_location: "Nogales, Sonora. México",
  },
  {
    team1Img: team3,
    team1Name: "TRIPLE X",
    team2Img: team4,
    team2Name: "Mariposas Z",
    hora: "7:00 PM",
    cancha: "La Vista",
    tournament: "Torneo Verano II",
    tournament_image: tournament1,
    tournament_location: "Nogales, Sonora. México",
  },
  {
    team1Img: team5,
    team1Name: "Los Grandes",
    team2Img: team6,
    team2Name: "Amazonas",
    hora: "8:00 PM",
    cancha: "La Vista",
    tournament: "Torneo Verano II",
    tournament_image: tournament1,
    tournament_location: "Nogales, Sonora. México",
  },
];

export function OrganizerHomeContent() {
  return (
    <SectionContainer>
      <div className="p-6 flex flex-col">
        <h1 className="text-5xl font-extralight font-bebas mb-2 text-ink">
          Hola <span className="text-primary font-normal">Julián Lopez</span>
        </h1>

        <div className="flex flex-col">
          <p className="text-xl font-extralight mb-6">Partidos para hoy</p>

          <div className="grid gap-6 grid-cols-3">
            {matches.map((m, i) => (
              <MatchCard
                key={i}
                team1Img={m.team1Img}
                team1Name={m.team1Name}
                team2Img={m.team2Img}
                team2Name={m.team2Name}
                hora={m.hora}
                cancha={m.cancha}
                tournament={m.tournament}
                tournament_image={m.tournament_image}
                tournament_location={m.tournament_location}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
