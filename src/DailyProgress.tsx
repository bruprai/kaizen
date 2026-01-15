import { useCallback, useEffect, useRef, useState } from "react";
import { type onUpdateTaskParams, type TaskModel } from "./models/types";
import { processContent } from "./utils/taskUtils";
import { TASK_STATUSES } from "./constants";

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
    if (e.key === "Enter") {
      if (task) {
        const { tags, cleanContent } = processContent(task.content);
        onUpdate({ taskId: task.id, updates: { tags, content: cleanContent } });

        (e.target as HTMLInputElement).blur();
      } else if (input.trim()) {
        onAdd(input);
        setInput("");
      }
    }
    if (e.altKey && e.key === "Delete" && task) {
      onUpdate({
        taskId: task.id,
        updates: { status: TASK_STATUSES.DONE },
      });
    }
  };

  return (
    <section className="daily-progress">
      <h1>Daily Progress</h1>
      <p>Track your daily activities and progress.</p>
      <div className="progress-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-input-wrapper">
            <input
              key={task.id}
              type="text"
              value={task.content}
              onKeyDown={(e) => handleKeyDown(e, task)}
              onBlur={(e) => {
                console.log("on blur cleaing content of tags");
                const { tags, cleanContent } = processContent(e.target.value);
                onUpdate({
                  taskId: task.id,
                  updates: { content: cleanContent, tags },
                });
              }}
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
            <div className="tags-overlay">
              {task.tags.map((tag) => (
                <span className="tag-pill">#{tag}</span>
              ))}
            </div>
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
