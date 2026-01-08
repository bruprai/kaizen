import "./App.css";
import { getDateKey, getFormatedDate } from "./utils/dateUtils.ts";
import { DailyProgress } from "./DailyProgress.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createNewDailyProgressEntry,
  type DailyProgressModel,
} from "./types.ts";
import {
  loadDailyProgressData,
  saveDailyProgressData,
} from "./utils/localStorageUtils.ts";

function App() {
  const [allProgressDays, setAllProgressDays] = useState<DailyProgressModel[]>(
    []
  );
  const [currentDayIndex, setCurrentDayIndex] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { day, date } = getFormatedDate();

  useEffect(() => {
    const loadData = () => {
      const loadedData = loadDailyProgressData();
      let updatedData = [...loadedData];
      const todayKey = getDateKey();
      let todayIndex = loadedData.findIndex((day) => day.dateKey === todayKey);
      if (todayIndex === -1) {
        const newProgressToday = createNewDailyProgressEntry();
        updatedData = [...updatedData, newProgressToday].sort((a, b) =>
          a.dateKey.localeCompare(b.dateKey)
        );
        setAllProgressDays(updatedData);
        todayIndex = updatedData.findIndex((day) => day.dateKey === todayKey);
      }
      setCurrentDayIndex(todayIndex);
      setAllProgressDays(updatedData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading && allProgressDays.length > 0) {
      saveDailyProgressData(allProgressDays);
    }
  }, [allProgressDays, isLoading]);

  const handleUpdate = useCallback((updatedDay: DailyProgressModel) => {
    setAllProgressDays((prevDays) => {
      const existingDayIndex = prevDays.findIndex(
        (day) => day.dateKey === updatedDay.dateKey
      );
      if (existingDayIndex !== -1) {
        const newDays = [...prevDays];
        newDays[existingDayIndex] = updatedDay;
        return newDays;
      } else {
        return [...prevDays, updatedDay].sort((a, b) =>
          a.dateKey.localeCompare(b.dateKey)
        );
      }
    });
  }, []);

  const currentDayData = allProgressDays[currentDayIndex!];
  const isCurrentDayToday = currentDayData?.dateKey === getDateKey();

  return (
    <>
      <h1 className="app-name">
        <span>Kai</span>
        <span>zen</span>
      </h1>
      <section className="date-display">
        <span>
          <strong>{day}</strong>
          {date}
        </span>
      </section>
      {isLoading ? (
        <p
          style={{
            textAlign: "center",
            marginTop: "100px",
            fontSize: "1.2em",
            color: "#fff",
          }}
        >
          Loading daily progress...
        </p>
      ) : (
        currentDayData && (
          <DailyProgress
            key={currentDayData.dateKey}
            progressDay={currentDayData}
            onUpdateProgress={handleUpdate}
            isEditable={isCurrentDayToday}
          />
        )
      )}
    </>
  );
}

export default App;
