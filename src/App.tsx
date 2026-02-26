import { getDateKey, getFormatedDate } from "./utils/dateUtils.ts";
import { DailyProgress } from "./DailyProgress.tsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTaskStore } from "./hooks/useTaskStore.ts";
import { sortTasksByHierarchy } from "./utils/taskUtils.ts";
import { ThemeToggle } from "./components/ThemeToggle.tsx";

function App() {
  const { store, addTask, deleteTask, updateTask, getTasksByDateKey } =
    useTaskStore();

  const [viewingDate, setViewingDate] = useState(new Date());

  const dateKey = getDateKey(viewingDate);
  const { day, date } = getFormatedDate(viewingDate);
  const isToday = dateKey === getDateKey();
  // const allDateKeys = useMemo(() => {
  //   const activeDates = Object.keys(store.daysIndex);
  //   if (!store.daysIndex[todayKey]) {
  //     activeDates.push(todayKey);
  //   }
  //   return activeDates.sort();
  // }, [ store.daysIndex]);

  const [animationClass, setAnimationClass] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLoaded = useRef(false);

  const changeDay = (offset: number) => {
    setAnimationClass(offset === -1 ? "slide-in" : "fade-out");
    const nextDate = new Date(viewingDate);
    nextDate.setDate(nextDate.getDate() + offset);
    setViewingDate(nextDate);
  };
  const tasksForToday = getTasksByDateKey(dateKey);
  const sortedTasks = sortTasksByHierarchy(tasksForToday);

  return (
    <div className="app-container">
      <ThemeToggle />
      <div className="nav-curtain left-curtain" onClick={() => changeDay(-1)}>
        <span>←</span>
      </div>
      <div className="nav-curtain right-curtain" onClick={() => changeDay(1)}>
        <span>→</span>
      </div>
      <div className="app-name">
        <span>Kai</span>
        <span>zen</span>
      </div>
      <h3 className="app-caption">Daily Progress</h3>
      <section className="date-display">
        <span>
          <strong>{day}</strong>
          {date}
        </span>
      </section>

      <div className={`progress-container ${animationClass}`}>
        <DailyProgress
          key={dateKey}
          dateKey={dateKey}
          tasks={sortedTasks}
          onAdd={(text, parentId) => addTask(text, dateKey, parentId)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          isToday={isToday}
        />
      </div>
    </div>
  );
}

export default App;
