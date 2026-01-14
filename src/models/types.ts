export interface TaskModel {
  id: string;
  content: string;
  // Union type - will only accept one of the 5 strings
  // define in TASK_STATUS
  status: TaskStatus;
  createdAt: string;
  updatedAt?: string;
  originDateKey: string;
  currentDateKey: string;
  parentId: string;
  tags: string[];
  history: string[];
}

export interface TaskStore {
  tasks: Record<string, TaskModel>;
  daysIndex: Record<string, string[]>;
  tagsIndex: Record<string, string[]>;
}

export const TASK_STATUSES = {
  TODO: "todo",
  MIGRATED: "migrated",
  DONE: "done",
  SCHEDULED: "scheduled",
  DISCARDED: "discarded",
} as const;

export type TaskStatus = (typeof TASK_STATUSES)[keyof typeof TASK_STATUSES];

export type onUpdateTaskParams = {
  taskId: string;
  updates?: Partial<TaskModel>;
};
