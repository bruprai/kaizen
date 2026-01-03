import "./App.css";
import { getFormatedDate } from "./utils.ts";
import { DailyProgress } from "./DailyProgress.tsx";

function App() {
  const { day, date } = getFormatedDate();

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

      <DailyProgress />
    </>
  );
}

export default App;
