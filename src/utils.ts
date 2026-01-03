export function getFormatedDate(): { day: string; date: string } {
  const newDate = new Date();
  const result = newDate.toString().split(" GMT")[0];

  const dayIndex = result.indexOf(" ");
  const day = result.substring(0, dayIndex);
  const date = result.substring(dayIndex);
  return { day, date };
}
