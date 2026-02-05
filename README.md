# Kaizen - Daily progress tracker

## To run the project

npm run dev

#### press tab for subtask

#### press shift + tab to get back to the main level

#### Press alt + d to mark it done

### I've always wanted to create this app where user can write down content or tasks about the projects they are working on day to day basis. Main feature is that undone tasks will be migrated to the next day.

#### There is task age which shows how many days ago a task was created.

#### I've also added some features like:

- Tags(which will be used to filter tasks by tags and differentiate between categories)
- Keyboard shortcut Alt + d to mark the task done
- Delete icon will be visible when you hover over the task.
- Visit previous day's tasks
- Plan tasks for the next day with #PFT tag which stands for plan for tomorrow
- Local first

### There are many features and improvements to implement:

- [] Differentiate multiple projects by their own space
  - [x] First tag can act as category like different project names
  - [x] Subtask inherited first tag automatically from the parent
- [] Weekly summary
- [] Edit tags
- [] Implement a search function to filter tasks by tags or project
- [] Implement a notification system to remind users of upcoming tasks
- [] Add auth and database
- [] Add context api and zustand later when features grow
- [] Upgrade UI

#### Started with prop drilling and most of the state in App.tsx

### Then added useTaskStore to manage the state but still alot of prop drilling

### Next is to use the context api and then components can access the state without pass argurments around.

### Used type safe string enum in for status field in task model to make it easier to read, compare and maintain. (Mainly because i missed Dart Enum functionality which i use quite often there).

- Pro here is that i don't need to convert string to enum(like i do in dart) manually as TaskStatus is just a string, it works well with JSON data from an API or Database.

### Added a local storage key for last active date to keep track of the user's activity.

### Uses localized indexing to keep searches lightning-fast, no matter how many tasks you add
