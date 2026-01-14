# Kaizen Task Store

### Used type safe string enum in for status field in task model to make it easier to read, compare and maintain. (Mainly because i missed Dart Enum functionality which i use quite often there).

- Pro here is that i don't need to convert string to enum(like i do in dart) manually as TaskStatus is just a string, it works well with JSON data from an API or Database.

### Added a local storage key for last active date to keep track of the user's activity.
