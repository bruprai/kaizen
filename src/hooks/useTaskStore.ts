import { useEffect, useState } from "react";
import {
  type onUpdateTaskParams,
  type TaskModel,
  type TaskStore,
} from "../models/types";
import { getDateKey, getTimestamp } from "../utils/dateUtils";
import { STORAGE_KEYS, TASK_STATUSES } from "../constants";
import {
  migrateTasks,
  processContent,
  rebuildIndexes,
} from "../utils/taskUtils";

export const useTaskStore = () => {
  const today = getDateKey();

  const [store, setStore] = useState<TaskStore>(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.data);
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
    localStorage.setItem(STORAGE_KEYS.data, JSON.stringify(store));
    localStorage.setItem(STORAGE_KEYS.lastActive, today);
  }, [store]);

  const addTask = (
    content: string,
    dateKey: string,
    parentId?: string
  ): string => {
    const { tags, cleanContent } = processContent(content);

    const taskId = crypto.randomUUID();

    const newTask: TaskModel = {
      id: taskId,
      content: cleanContent,
      status: TASK_STATUSES.TODO,
      createdAt: getTimestamp(),
      originDateKey: dateKey,
      currentDateKey: dateKey,
      parentId: parentId || "",
      tags,
      history: [],
    };

    setStore((prev) => {
      const updatedTasks = { ...prev.tasks, [taskId]: newTask };
      return rebuildIndexes(updatedTasks);
    });
    return newTask.id;
  };

  const updateTask = (params: onUpdateTaskParams) => {
    console.log("useStore: update task", params);
    setStore((prev) => {
      const oldTask = prev.tasks[params.taskId!];
      console.log("useStore: update task", oldTask);
      if (!oldTask) return prev;
      const updatedTasks = { ...prev.tasks };
      const newStatus = params.updates?.status;
      updatedTasks[params.taskId] = {
        ...oldTask,
        ...params.updates,
        tags: params.updates?.tags
          ? Array.from(new Set([...oldTask.tags, ...params.updates?.tags]))
          : oldTask.tags,

        updatedAt: getTimestamp(),
      };
      if (newStatus) {
        Object.values(updatedTasks).forEach((task) => {
          if (task.parentId === params.taskId) {
            updatedTasks[task.id] = {
              ...task,
              status: newStatus,
              updatedAt: getTimestamp(),
            };
          }
        });
      }
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
