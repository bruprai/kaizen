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
  const [animationClass, setAnimationClass] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLoaded = useRef(false);

  const scrollDebounceRef = useRef<number | null>(null);

  useEffect(() => {
    console.log("App is loading");

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
      setTimeout(() => {
        isLoaded.current = true;
      }, 0);
    };
    loadData();
  }, []);

  const changeDay = (direction: number) => {
    setAnimationClass(direction === -1 ? "slide-in" : "fade-out");
    setCurrentDayIndex((prevIndex) => {
      if (prevIndex === undefined) return prevIndex;
      const nextIndex = prevIndex + direction;
      return Math.max(0, Math.min(allProgressDays.length, nextIndex));
    });
  };

  // useEffect(() => {
  //   const handleWheelScroll = (e: WheelEvent) => {
  //     const { deltaX } = e;
  //     console.log("deltaX:", deltaX);
  //     if (isLoading) return;
  //     if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);

  //     scrollDebounceRef.current = setTimeout(() => {
  //       if (Math.abs(e.deltaY) < 20) return;
  //       // Scroll down (positive delta) -> go back (index - 1)
  //       // Scroll up (negative delta) -> go forward (index + 1)
  //       changeDay(e.deltaY > 0 ? -1 : 1);
  //     }, 100);
  //   };

  //   window.addEventListener("wheel", handleWheelScroll);
  //   return () => window.removeEventListener("wheel", handleWheelScroll);
  // }, [isLoading, allProgressDays.length]);

  const handleUpdate = useCallback((updatedDay: DailyProgressModel) => {
    console.log("handle update", updatedDay);
    setAllProgressDays((prevDays) => {
      const nextDays = [...prevDays];
      const existingDayIndex = prevDays.findIndex(
        (day) => day.dateKey === updatedDay.dateKey
      );
      if (existingDayIndex !== -1) {
        nextDays[existingDayIndex] = updatedDay;
      } else {
        nextDays.push(updatedDay);
        nextDays.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
      }
      console.log("before saving daily progress", nextDays);

      saveDailyProgressData(nextDays);
      return nextDays;
    });
  }, []);

  const currentDay = allProgressDays[currentDayIndex ?? 0];
  let displayDate: Date;

  if (currentDay) {
    displayDate = new Date(currentDay.dateKey + "T00:00:00");
  } else {
    const lastEntry = allProgressDays[allProgressDays.length - 1];
    console.log("last entry", lastEntry);
    const baseDate = lastEntry
      ? new Date(lastEntry.dateKey + "T00:00:00")
      : new Date();
    console.log("base date", baseDate);
    baseDate.setDate(baseDate.getDate() + 1);
    console.log("base date after increment", baseDate);
    displayDate = baseDate;
  }

  const { day, date } = getFormatedDate(displayDate);

  const isEditable = currentDay?.dateKey === getDateKey();

  return (
    <div className="app-container">
      <div className="nav-curtain left-curtain" onClick={() => changeDay(-1)}>
        <span>←</span>
      </div>
      <div className="nav-curtain right-curtain" onClick={() => changeDay(1)}>
        <span>→</span>
      </div>
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
            color: "#eee",
          }}
        >
          Loading daily progress...
        </p>
      ) : (
        currentDay && (
          <div className={`progress-container ${animationClass}`}>
            <DailyProgress
              key={currentDay.dateKey}
              progressDay={currentDay}
              onUpdateProgress={handleUpdate}
              isEditable={isEditable}
            />
          </div>
        )
      )}
    </div>
  );
}

export default App;
