export function getFormatedDate(inputDate: Date = new Date()) {
  const day = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    inputDate
  );
  const monthDay = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(inputDate);
  return { day, date: monthDay };
}

export function getDateKey(inputDate: Date = new Date()): string {
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const getTimestamp = () => new Date().toISOString();
