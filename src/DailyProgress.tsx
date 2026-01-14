import { useCallback, useEffect, useRef, useState } from "react";
import {
  TASK_STATUSES,
  type onUpdateTaskParams,
  type TaskModel,
} from "./models/types";

interface props {
  dateKey: string;
  tasks: TaskModel[];
  onAdd: (text: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (params: onUpdateTaskParams) => void;
  isToday: boolean;
}

export const DailyProgress: React.FC<props> = ({
  dateKey,
  tasks,
  onAdd,
  onUpdate,
  onDelete,
  isToday,
}) => {
  const [input, setInput] = useState<string>("");

  const taskRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());

  const focusItem = (targetIndex: number): void => {
    if (targetIndex >= 0 && targetIndex < tasks.length) {
      const targetItemId = tasks[targetIndex].id;
      const targetInput = taskRefs.current.get(targetItemId);
      if (targetInput) {
        targetInput.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, task?: TaskModel) => {
    if (e.key === "Enter" && input.trim() && !task) {
      console.log("adding task on enter", input);
      onAdd(input);
      setInput("");
    } else {
      if (e.altKey && e.key === "Delete" && task) {
        onUpdate({
          taskId: task.id,
          updates: { status: TASK_STATUSES.DONE },
        });
      }
    }
  };
  return (
    <section className="daily-progress">
      <h1>Daily Progress</h1>
      <p>Track your daily activities and progress.</p>
      <div className="progress-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <input
              key={task.id}
              type="text"
              value={task.content}
              onKeyDown={(e) => handleKeyDown(e, task)}
              onChange={(e) =>
                onUpdate({
                  taskId: task.id,
                  updates: { content: e.target.value },
                })
              }
              className="progress-input"
              readOnly={!isToday}
              style={{
                textDecoration:
                  task.status === TASK_STATUSES.DONE ? "line-through" : "none",
                opacity: task.status === TASK_STATUSES.DONE ? 0.6 : 1,
              }}
            />
            <span className="tags-preview">
              <div>{task.tags.map((t) => `#${t}`)}</div>
            </span>
          </div>
        ))}

        {!isToday && tasks.every((task) => task.content.trim() === "") && (
          <p className="no-entry-message">No enteries for this day</p>
        )}
        {isToday && (
          <div className="input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              placeholder="Add new task (try using #tags)..."
              className="progress-input new-task-input"
            />
          </div>
        )}
      </div>
    </section>
  );
};
