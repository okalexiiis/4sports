/* TYPES */
import { FieldValues, Path, RegisterOptions } from "react-hook-form";

export type SpecificInputFileProps<T extends FieldValues> = {
  accept?: string;
  rules?: RegisterOptions<T, Path<T>>;
  name: Path<T>;
  preview: string | null;
  twClassNameContainer?: string
  twClassNameButton?: string
};