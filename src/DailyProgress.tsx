import { useCallback, useEffect, useRef, useState } from "react";
import { type onUpdateTaskParams, type TaskModel } from "./models/types";
import {
  getCategories,
  getMigratedTasks,
  getParentId,
  processContent,
} from "./utils/taskUtils";
import { TASK_STATUSES } from "./constants";
import { useTaskStore } from "./hooks/useTaskStore";
import {
  CategoriesIcon,
  CategoriesIconAll,
  SortAscIcon,
  SortDescIcon,
} from "./components/Icons";

interface props {
  dateKey: string;
  tasks: TaskModel[];
  onAdd: (text: string, parentId?: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (params: onUpdateTaskParams) => void;
  isToday: boolean;
}

export const DailyProgress: React.FC<props> = ({
  dateKey,
  tasks,
  onAdd,
  onDelete,
  onUpdate,
  isToday,
}) => {
  const [input, setInput] = useState<string>("");
  const [isNextSubtask, setIsNextSubtask] = useState(false);
  const [allCategories, setAllCategories] = useState(false);
  const [sortTasksByAge, setSortTasksByAge] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const { store } = useTaskStore();
  const taskRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());

  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;

    const handleCategoryScroll = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollBy({
        left: e.deltaY * 1.5,
        behavior: "smooth",
      });
    };
    el.addEventListener("wheel", handleCategoryScroll, { passive: false });
    return () => el.removeEventListener("wheel", handleCategoryScroll);
  }, []);

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
        handleChange(task.id, task.content, { isFinal: true });
        (e.target as HTMLInputElement).blur();
      } else if (input.trim()) {
        const lastTopLevelTask = [...tasks]
          .reverse()
          .find((t) => t.parentId === "");
        const parentId =
          isNextSubtask && lastTopLevelTask ? lastTopLevelTask.id : "";

        onAdd(input, parentId);
        setInput("");
        setIsNextSubtask(false);
      }
    }
    if (e.altKey && e.key.toLowerCase() === "d" && task) {
      e.preventDefault();
      const nextStatus =
        task.status === TASK_STATUSES.DONE
          ? TASK_STATUSES.TODO
          : TASK_STATUSES.DONE;
      onUpdate({
        taskId: task.id,
        updates: { status: nextStatus },
      });
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (currentIndex === tasks.length - 1 || currentIndex === -1) {
        // If on last task or new task input, focus the new task input (or wrap to top)
        const newInnerInput = document.querySelector(
          ".task-input",
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

  const handleChange = (taskId: string, value: string, { isFinal = false }) => {
    console.log("updateTask");
    const { tags, cleanContent } = processContent(value, isFinal);

    onUpdate({
      taskId: taskId,
      updates: { content: cleanContent, tags },
    });
  };

  const toggleCategories = () => {
    console.log("toggleCategories");
    setAllCategories((prev) => !prev);
    setSelectedCategory(null);
  };

  const handleCategory = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };
  const allTasksArray = Object.values(store.tasks);
  const migratedTasks = getMigratedTasks(dateKey, allTasksArray);
  const projectTags = getCategories(allCategories ? allTasksArray : tasks);

  const categoryFilteredTasks = selectedCategory
    ? tasks.filter(
        (t) => t.tags[0]?.toLowerCase() === selectedCategory.toLowerCase(),
      )
    : tasks;

  const displayTasks = !sortTasksByAge
    ? [...categoryFilteredTasks].sort(
        (t1, t2) =>
          new Date(t2.createdAt).getTime() - new Date(t1.createdAt).getTime(),
      )
    : categoryFilteredTasks;

  const toggleSortByAge = () => {
    setSortTasksByAge((prev) => {
      console.log("Toggling sort by age. New state:", !prev);
      return !prev;
    });
  };
  const isActiveCategory = (category: string) => category === selectedCategory;

  return (
    <section className="daily-progress">
      <br />
      <div className="categories">
        <button
          className="toggle-categories"
          onClick={() => toggleCategories()}
        >
          {allCategories ? <CategoriesIconAll /> : <CategoriesIcon />}
        </button>
        <div className="category-button-wrapper" ref={categoryScrollRef}>
          {projectTags.map((category) => (
            <button
              key={category}
              className={`category-button ${
                isActiveCategory(category) ? "active" : ""
              }`}
              onClick={() => handleCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <button
          className={`sort-button ${sortTasksByAge ? "active" : ""}`}
          onClick={() => toggleSortByAge()}
        >
          {sortTasksByAge ? <SortDescIcon /> : <SortAscIcon />}
        </button>
      </div>
      <div className="progress-list">
        {displayTasks.map((task) => (
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
              onBlur={(e) => {
                console.log("on blur content");
                handleChange(task.id, e.target.value, { isFinal: true });
              }}
              onChange={(e) => {
                handleChange(task.id, e.target.value, { isFinal: false });
              }}
              className={`task-input ${task.status === TASK_STATUSES.DONE ? "completed fade" : ""}`}
              readOnly={!isToday}
            />
            <div className="tags-overlay">
              {task.tags.map((tag) => {
                const displayTag = tag !== selectedCategory ? tag : "";
                return (
                  <span
                    key={task.id + tag}
                    className={`tag-pill ${task.status === TASK_STATUSES.DONE ? "fade" : ""}`}
                  >
                    {displayTag}
                  </span>
                );
              })}
            </div>
            <div className="task-age">
              {task.history && task.history.length > 0 && (
                <span title={`Migrated ${task.history.length} times`}>
                  {task.history.length}d
                </span>
              )}
            </div>
            <div>
              <button className="delete-icon" onClick={() => onDelete(task.id)}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}

        {!isToday && (
          <div className="status-message-container">
            {tasks.every((task) => task.content.trim() === "") &&
              migratedTasks.length === 0 && (
                <p className="no-entry-message">No enteries for this day</p>
              )}

            {migratedTasks.length !== 0 && (
              <>
                <p className="migration-message">
                  {migratedTasks.length}{" "}
                  {migratedTasks.length > 1 ? "entries" : "entry"} moved to the
                  next day
                </p>
              </>
            )}
          </div>
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
              placeholder="Add new task (try using #tags)... Alt + d to mark it done"
              className="task-input new-task-input"
            />
          </div>
        )}
      </div>
    </section>
  );
};
