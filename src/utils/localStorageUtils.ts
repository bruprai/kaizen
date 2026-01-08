import type { DailyProgressModel } from "../types";

const LOCAL_STORAGE_KEY = "dailyProgressData";

export function loadDailyProgressData(): DailyProgressModel[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (data) {
      const parsedData: DailyProgressModel[] = JSON.parse(data);
      return parsedData.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
    }
  } catch (error) {
    console.error("Error loading daily progress local data:", error);
  }
  return [];
}

export function saveDailyProgressData(
  dailyProgress: DailyProgressModel[]
): void {
  try {
    const data = JSON.stringify(dailyProgress);
    localStorage.setItem(LOCAL_STORAGE_KEY, data);
  } catch (error) {
    console.error("Error saving daily progress local data:", error);
  }
}
