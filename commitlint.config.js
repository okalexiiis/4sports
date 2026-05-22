/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Tipos válidos según EQUIPO.md
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "chore", "refactor", "docs", "test"],
    ],
    // Descripción en minúscula
    "subject-case": [2, "always", "lower-case"],
    // Sin punto al final
    "subject-full-stop": [2, "never", "."],
    // Descripción obligatoria
    "subject-empty": [2, "never"],
    // Tipo obligatorio
    "type-empty": [2, "never"],
  },
};
 
