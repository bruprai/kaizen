import { DIRECTION, REGEX, TASK_STATUSES } from "../constants";
import type { TaskModel, TaskStore } from "../models/types";
import { getDateKey } from "./dateUtils";

export const getMigratedTasks = (
  viewingDate: string,
  tasks: TaskModel[]
): TaskModel[] => tasks.filter((task) => task.history.includes(viewingDate));

export const processContent = (text: string, isFinal?: boolean) => {
  console.log("processContent text", text);
  const regex = isFinal ? REGEX.tagsInString : REGEX.tagsFollowedBySpace;
  const tags = [...text.matchAll(regex)].map((m) => m[1].toLowerCase());
  let cleanContent = text.replace(regex, "");

  if (isFinal) {
    cleanContent = cleanContent.trim();
  }
  console.log("clean content", cleanContent);
  return { tags, cleanContent };
};

export const migrateTasks = (oldStore: TaskStore, today: string): TaskStore => {
  const updatedTasks = { ...oldStore.tasks };

  Object.values(updatedTasks).forEach((task) => {
    if (task.status === TASK_STATUSES.TODO && task.currentDateKey < today) {
      if (!task.history) task.history = [];
      task.history.push(task.currentDateKey);
      task.currentDateKey = today;
    }
    // plan for tomorrow = pft
    if (task.tags.includes("pft")) {
      task.currentDateKey = today;
      task.status = TASK_STATUSES.TODO;
      task.tags = task.tags.filter((tag) => tag !== "pft");
    }
  });
  return rebuildIndexes(updatedTasks);
};

export const rebuildIndexes = (tasks: Record<string, TaskModel>): TaskStore => {
  const daysIndex: Record<string, string[]> = {};
  const tagsIndex: Record<string, string[]> = {};
  console.log("Rebuilding indexes...");
  Object.values(tasks).forEach((task) => {
    if (!daysIndex[task.currentDateKey]) {
      daysIndex[task.currentDateKey] = [];
    }
    daysIndex[task.currentDateKey].push(task.id);
    task.tags.forEach((tag) => {
      if (!tagsIndex[tag]) {
        tagsIndex[tag] = [];
      }
      tagsIndex[tag].push(task.id);
    });
  });
  return { tasks, daysIndex, tagsIndex };
};

export const getParentId = (
  taskId: string | undefined,
  direction: "indent" | "outdent",
  tasksInView: TaskModel[]
): string | null => {
  console.log("Direction", direction);
  if (direction === DIRECTION.outdent) return null;
  if (!taskId)
    return tasksInView.length > 0
      ? tasksInView[tasksInView.length - 1].id
      : null;
  const currentIndex = tasksInView.findIndex((task) => task.id === taskId);
  if (currentIndex > 0) {
    console.log("returning parent id ", tasksInView[currentIndex - 1].id);
    return tasksInView[currentIndex - 1].id;
  }
  return null;
};

export const sortTasksByHierarchy = (tasks: TaskModel[]): TaskModel[] => {
  const parents = tasks.filter((task) => !task.parentId);
  const children = tasks.filter((task) => task.parentId);
  const result: TaskModel[] = [];
  parents.forEach((parent) => {
    result.push(parent);
    const subtasks = children.filter((child) => child.parentId === parent.id);
    subtasks.forEach((subtask) => {
      result.push(subtask);
    });
  });
  console.log("sortTasksByHierarchy Result", result);
  return result;
};
