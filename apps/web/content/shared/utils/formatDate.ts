export function formatDate(date: string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    return "Fecha inválida";
  }

  const parts = date.split("-");
  const finalDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
  return finalDate;
}

export function formatDateTimeManual(dateTimeString: string) {
  const [datePart, timePart] = dateTimeString.split(" ");
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year.slice(-2)} ${timePart}`;
}
