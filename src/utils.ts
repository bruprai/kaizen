export function getFormatedDate(): { day: string; date: string } {
  const newDate = new Date();
  const result = newDate.toString().split(" GMT")[0];
  const dateWithoutSeconds = result.substring(0, result.length - 3);
  const dayIndex = dateWithoutSeconds.indexOf(" ");
  const day = dateWithoutSeconds.substring(0, dayIndex);
  const date = dateWithoutSeconds.substring(dayIndex);
  return { day, date };
}
export function getDisplayDate(): string {
  const { day, date } = getFormatedDate();
  return `${day} ${date}`;
}

export function getDateKey(): string {
  const newDate = new Date();
  const year = newDate.getFullYear();
  const month = newDate.getMonth();
  const day = newDate.getDay();
  const dateKey = `${year}-${month + 1}-${day}`;
  return dateKey;
}
