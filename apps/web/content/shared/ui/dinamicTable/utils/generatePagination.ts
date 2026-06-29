type PaginationItem = number | "...";

export function generatePagination(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  const pages: PaginationItem[] = [];

  // Si hay pocas páginas, mostrar todas
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Inicio
  if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, "...", totalPages);

    return pages;
  }

  // Final
  if (currentPage >= totalPages - 2) {
    pages.push(
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );

    return pages;
  }

  // Medio
  pages.push(
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  );

  return pages;
}
