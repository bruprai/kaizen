import { useCallback, useEffect, useRef, useState } from "react";
import { type onUpdateTaskParams, type TaskModel } from "./models/types";
import { getParentId, processContent } from "./utils/taskUtils";
import { TASK_STATUSES } from "./constants";

interface props {
  dateKey: string;
  tasks: TaskModel[];
  onAdd: (text: string, parentId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (params: onUpdateTaskParams) => void;
  isToday: boolean;
}

export const DailyProgress: React.FC<props> = ({
  tasks,
  onAdd,
  onDelete,
  onUpdate,
  isToday,
}) => {
  const [input, setInput] = useState<string>("");
  const [isNextSubtask, setIsNextSubtask] = useState(false);

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
    const currentIndex = task ? tasks.findIndex((t) => t.id === task.id) : -1;
    if (e.key === "Tab") {
      e.preventDefault();
      console.log("tab tab");
      const direction = e.shiftKey ? "outdent" : "indent";

      if (task) {
        const parentId = getParentId(task?.id!, direction, tasks);
        if (parentId !== undefined) {
          onUpdate({ taskId: task.id, updates: { parentId: parentId || "" } });
        }
      } else {
        console.log("new subtask ", isNextSubtask);
        const canIndent = direction === "indent" && tasks.length > 0;
        setIsNextSubtask(canIndent);
      }
    }
    if (e.key === "Enter") {
      if (task) {
        const { tags, cleanContent } = processContent(task.content);
        onUpdate({ taskId: task.id, updates: { tags, content: cleanContent } });

        (e.target as HTMLInputElement).blur();
      } else if (input.trim()) {
        console.log("new task");
        const lastTopLevelTask = [...tasks].reverse().find((t) => !t.parentId);
        const parentId =
          isNextSubtask && lastTopLevelTask ? lastTopLevelTask.id : "";
        console.log("parentId", parentId);
        onAdd(input, parentId);
        setInput("");
        setIsNextSubtask(false);
      }
    }
    if (e.altKey && e.key === "Delete" && task) {
      onUpdate({
        taskId: task.id,
        updates: { status: TASK_STATUSES.DONE },
      });
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (currentIndex === tasks.length - 1 || currentIndex === -1) {
        // If on last task or new task input, focus the new task input (or wrap to top)
        const newInnerInput = document.querySelector(
          ".task-input"
        ) as HTMLInputElement;
        newInnerInput?.focus();
      } else {
        focusItem(currentIndex + 1);
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (currentIndex === -1) {
        // If we are in the "New Task" input (currentIndex -1), go to the last task
        focusItem(tasks.length - 1);
      } else if (currentIndex > 0) {
        focusItem(currentIndex - 1);
      }
    }
  };

  const updateTask = (task: TaskModel, value: string) => {
    console.log("updateTask");
    const { tags, cleanContent } = processContent(value);
    console.log("tags,clean data, value", tags, cleanContent, task.content);

    onUpdate({
      taskId: task.id,
      updates: { content: cleanContent, tags: tags },
    });
  };

  return (
    <section className="daily-progress">
      <h1>Daily Progress</h1>
      <p>Track your daily activities and progress.</p>
      <div className="progress-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-input-wrapper ${
              task.parentId ? "is-subtask" : ""
            }`}
          >
            <input
              key={task.id}
              ref={(element) => {
                taskRefs.current.set(task.id, element);
              }}
              type="text"
              value={task.content}
              onKeyDown={(e) => handleKeyDown(e, task)}
              // onBlur={(e) => {
              //   console.log("on blur content");
              //   updateTask(task.id, e.target.value);
              // }}
              onChange={(e) => {
                updateTask(task, e.target.value);
              }}
              className="task-input"
              readOnly={!isToday}
              style={{
                textDecoration:
                  task.status === TASK_STATUSES.DONE ? "line-through" : "none",
                opacity: task.status === TASK_STATUSES.DONE ? 0.6 : 1,
              }}
            />
            <div className="tags-overlay">
              {task.tags.map((tag) => (
                <span key={task.id + tag} className="tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="delete-icon">
              <button onClick={() => onDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))}

        {!isToday && tasks.every((task) => task.content.trim() === "") && (
          <p className="no-entry-message">No enteries for this day</p>
        )}
        {isToday && (
          <div
            className={`task-input-wrapper ${
              isNextSubtask ? "is-subtask" : ""
            }`}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              placeholder="Add new task (try using #tags)..."
              className="task-input new-task-input"
            />
          </div>
        )}
      </div>
    </section>
  );
};
