import { useEffect, useState } from "react";
import {
  type onUpdateTaskParams,
  type TaskModel,
  type TaskStore,
} from "../models/types";
import { getTimestamp } from "../utils/dateUtils";
import { STORAGE_KEYS, REGEX, TASK_STATUSES } from "../constants";
import {
  migrateTasks,
  processContent,
  rebuildIndexes,
} from "../utils/taskUtils";

export const useTaskStore = () => {
  const today = new Date().toISOString().split("T")[0];
  const [store, setStore] = useState<TaskStore>(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.date);
    const lastActive = localStorage.getItem(STORAGE_KEYS.lastActive);
    console.log("new Date().toISOString()", new Date().toISOString());

    console.log("saved data", savedData);
    if (savedData) {
      let currentStore: TaskStore = JSON.parse(savedData);
      if (lastActive && lastActive < today) {
        currentStore = migrateTasks(currentStore, today);
      }
      console.log("Current Store:", currentStore);
      return currentStore;
    }
    return {
      tasks: {},
      daysIndex: { [today]: [] },
      tagsIndex: {},
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.date, JSON.stringify(store));
    localStorage.setItem(STORAGE_KEYS.lastActive, today);
  }, [store]);

  const addTask = (content: string, dateKey: string) => {
    const { tags, cleanContent } = processContent(content);

    const taskId = crypto.randomUUID();

    const newTask: TaskModel = {
      id: taskId,
      content: cleanContent,
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
          ...params.updates!.content!.matchAll(REGEX.tags),
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
