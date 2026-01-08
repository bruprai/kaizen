import { getDateKey, getDisplayDate } from "./utils/dateUtils";

export interface ProgressItemModel {
  id: string;
  text: string;
  completed?: boolean;
}
export interface DailyProgressModel {
  dateKey: string;
  displayDate: string;
  items: ProgressItemModel[];
}
export function createNewProgressItem(): ProgressItemModel {
  return { id: `${Date.now()}`, text: "" };
}
export function createNewDailyProgressEntry(): DailyProgressModel {
  return {
    dateKey: getDateKey(),
    displayDate: getDisplayDate(),
    items: [createNewProgressItem()],
  };
}
