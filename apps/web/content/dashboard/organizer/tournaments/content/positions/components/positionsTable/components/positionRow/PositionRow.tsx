"use client";

/* COMPONENTS */
import { DinamicRow } from "@/content/shared/ui/dinamicTable/components/dinamicRow/DinamicRow";
import { DinamicTd } from "@/content/shared/ui/dinamicTable/components/dinamicTd/DinamicTd";
import Image from "next/image";

/* TYPES */
import { PositionType } from "../../types/positionType";

export function RegistrationRow({
  position,
  twBgColor,
  positionNumber,
}: {
  position: PositionType;
  twBgColor: string;
  positionNumber: number;
}) {
  return (
    <DinamicRow twBgColor={twBgColor}>
      <DinamicTd twClassName="text-nowrap">
        <p>{positionNumber}°</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <div className="flex items-center gap-4">
          <Image
            alt="Equipo"
            src={position.teamPhoto}
            quality={70}
            loading="lazy"
            className="w-10 h-10 min-w-10 min-h-10 rounded-full"
          />

          <p>{position.teamName}</p>
        </div>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{position.pj}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{position.pg}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{position.pe}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{position.pp}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{position.gf}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{position.gc}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{position.dg}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{position.pts}</p>
      </DinamicTd>
    </DinamicRow>
  );
}
