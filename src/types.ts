import { getDateKey, getDisplayDate } from "./utils";

export interface ProgressItem {
  id: string;
  text: string;
  completed?: boolean;
}
export interface DailyProgress {
  dateKey: string;
  displayDate: string;
  items: ProgressItem[];
}
export function createNewProgressItem(): ProgressItem {
  return { id: `${Date.now()}`, text: "" };
}
export function createNewDailyProgressEntry(): DailyProgress {
  return {
    dateKey: getDateKey(),
    displayDate: getDisplayDate(),
    items: [createNewProgressItem()],
  };
}
