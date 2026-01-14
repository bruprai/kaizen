import { useEffect, useState } from "react";
import {
  TASK_STATUSES,
  type onUpdateTaskParams,
  type TaskModel,
  type TaskStore,
} from "../models/types";
import { getTimestamp } from "../utils/dateUtils";

const LOCAL_LAST_ACTIVE_DATE_KEY = "kaizen_last_active_date";
const LOCAL_DB_KEY = "kaizen-db_v1";
const TAG_REGEX = /#(\w+)/g;

export const useTaskStore = () => {
  const [store, setStore] = useState<TaskStore>(() => {
    const savedData = localStorage.getItem(LOCAL_DB_KEY);
    const lastActive = localStorage.getItem(LOCAL_LAST_ACTIVE_DATE_KEY);
    console.log("new Date().toISOString()", new Date().toISOString());
    const today = new Date().toISOString().split("T")[0];
    console.log("saved data", savedData);
    if (savedData) {
      let currentStore: TaskStore = JSON.parse(savedData);
      if (lastActive && lastActive < today) {
        currentStore = migrateTasks(currentStore, today);
      }
      console.log("Current Store:", currentStore);
      localStorage.setItem(LOCAL_LAST_ACTIVE_DATE_KEY, today);
      return currentStore;
    }
    return {
      tasks: {},
      daysIndex: { [today]: [] },
      tagsIndex: {},
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(store));
  }, [store]);

  const migrateTasks = (oldStore: TaskStore, today: string): TaskStore => {
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

  const rebuildIndexes = (tasks: Record<string, TaskModel>): TaskStore => {
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

  const addTask = (content: string, dateKey: string) => {
    const taskId = crypto.randomUUID();

    const tags = [...content.matchAll(TAG_REGEX)].map((match) =>
      match[1].toLowerCase()
    );

    const newTask: TaskModel = {
      id: taskId,
      content,
      status: TASK_STATUSES.TODO,
      createdAt: getTimestamp(),
      originDateKey: dateKey,
      currentDateKey: dateKey,
      parentId: "",
      tags,
      history: [],
    };

    setStore((prev) => {
      const updatedTasks = { ...prev.tasks, [taskId]: newTask };
      return rebuildIndexes(updatedTasks);
    });
  };

  const updateTask = (params: onUpdateTaskParams) => {
    setStore((prev) => {
      const oldTask = prev.tasks[params.taskId!];
      if (!oldTask) return prev;
      const updatedTask = {
        ...oldTask,
        ...params.updates,
        updatedAt: getTimestamp(),
      };
      if (params.updates?.content !== undefined) {
        updatedTask.tags = [
          ...params.updates!.content!.matchAll(TAG_REGEX),
        ].map((match) => match[1].toLowerCase());
      }
      const updatedTasks = {
        ...prev.tasks,
        [params.taskId!]: updatedTask,
      };
      return rebuildIndexes(updatedTasks);
    });
  };
  const deleteTask = (taskId: string) => {
    setStore((prev) => {
      const updatedTasks = { ...prev.tasks };
      delete updatedTasks[taskId];
      return rebuildIndexes(updatedTasks);
    });
  };
  const getTasksByDate = (dateKey: string): TaskModel[] => {
    const ids = store.daysIndex[dateKey] || [];
    // filter(Boolean) remove all "falsy" values
    // like null, undefined, 0, false, empty strings.
    return ids.map((id) => store.tasks[id]).filter(Boolean);
  };
  return {
    store,
    addTask,
    updateTask,
    deleteTask,
    getTasksByDateKey: getTasksByDate,
  };
};
