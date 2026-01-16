/// returns tags and content without tags

export const STORAGE_KEYS = {
  lastActive: "kaizen_last_active_date",
  data: "kaizen-db_v1",
} as const; // converts the object from "a general object with strings" to "a specific, read-only shape

export const REGEX = {
  tags: /#(\w+)/g,
  whitespace: /\s+/g,
} as const;

export const TASK_STATUSES = {
  TODO: "todo",
  MIGRATED: "migrated",
  DONE: "done",
  SCHEDULED: "scheduled",
  DISCARDED: "discarded",
} as const;

export const DIRECTION = {
  outdent: "outdent",
  indent: "indent",
} as const;

export const APP_CONFIG = {
  NAME: "Kaizen",
  VERSION: "0.1.2",
};
