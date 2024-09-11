import { Column, TaskActivity } from "./types";

export const columnData: Column[] = [
  {
    id: "col-1",
    title: "Open 🔘",
    status: "TO_DO",
  },
  {
    id: "col-2",
    title: "In Progress ⏳",
    status: "IN_PROGRESS",
  },
  {
    id: "col-3",
    title: "Done ✅",
    status: "DONE",
  },
  {
    id: "col-4",
    title: "Cancel 🚫",
    status: "CANCEL",
  },
];

export const taskActivities: TaskActivity[] = [
  {
    id: "activity-1",
    taskId: "task-1",
    user: "Thien Nguyen",
    date: new Date("2024-08-20T10:30:00"),
    content: "Hello, Thien was here. Have you done your task?",
  },
  {
    id: "activity-2",
    taskId: "task-1",
    user: "John Doe",
    date: new Date("2024-08-20T11:00:00"),
    content: "John reviewed the task and left some comments.",
  },
  {
    id: "activity-3",
    taskId: "task-1",
    user: "Jane Smith",
    date: new Date("2024-08-20T11:45:00"),
    content: "Jane marked the task as in progress.",
  },
  {
    id: "activity-4",
    taskId: "task-3",
    user: "Annonymous",
    date: new Date("2024-08-20T11:45:00"),
    content: "Oh, really?",
  },
];
