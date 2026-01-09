export function getFormatedDate(inputDate: Date = new Date()): {
  day: string;
  date: string;
} {
  const result = inputDate.toString().split(" GMT")[0];
  const dateWithoutSeconds = getDateWithoutSeconds(result);

  const dayIndex = dateWithoutSeconds.indexOf(" ");
  const day = dateWithoutSeconds.substring(0, dayIndex);
  const date = dateWithoutSeconds.substring(dayIndex);
  return { day, date };
}
export function getDisplayDate(): string {
  const { day, date } = getFormatedDate();
  return `${day} ${date}`;
}

function getDateWithoutSeconds(inputDate: string): string {
  let result = inputDate.toString().split(":")[0];
  return result.substring(0, result.length - 3);
}

export function getDateKey(inputDate: Date = new Date()): string {
  const year = inputDate.getFullYear();
  const month = inputDate.getMonth() + 1;
  const day = inputDate.getDate();
  const dateKey = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  return dateKey;
}
