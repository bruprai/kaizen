import { REGEX, TASK_STATUSES } from "../constants";
import type { TaskModel, TaskStore } from "../models/types";

/// returns tags and content without tags
export const processContent = (text: string) => {
  const tags = [...text.matchAll(REGEX.tags)].map((m) => m[1].toLowerCase());
  const cleanContent = text
    .replace(REGEX.tags, "")
    .replace(REGEX.whitespace, " ")
    .trim();
  return { tags, cleanContent };
};

export const migrateTasks = (oldStore: TaskStore, today: string): TaskStore => {
  const updatedTasks = { ...oldStore.tasks };

  Object.values(updatedTasks).forEach((task) => {
    if (task.status === TASK_STATUSES.TODO && task.currentDateKey < today) {
      if (task.history) task.history = [];
      task.history.push(task.currentDateKey);
      task.currentDateKey = today;
    }

    if (task.tags.includes("plan for tomorrow")) {
      task.currentDateKey = today;
      task.status = TASK_STATUSES.TODO;
      task.tags = task.tags.filter((tag) => tag !== "plan for tomorrow");
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
      console.log("day index value empty for that day: ", daysIndex);
    }
    daysIndex[task.currentDateKey].push(task.id);
    console.log("day index updated for: ", daysIndex);
    task.tags.forEach((tag) => {
      if (!tagsIndex[tag]) {
        tagsIndex[tag] = [];
        console.log("tag index value empty for this tag: ", tagsIndex);
      }
      tagsIndex[tag].push(task.id);
      console.log("tag index updated for: ", tagsIndex);
    });
  });
  return { tasks, daysIndex, tagsIndex };
};
