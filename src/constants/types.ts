export type Id = string | number;

// Auth
export type SignUpInput = {
  username: string;
  password: string;
  displayName: string;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type TokenInfo = {
  userId: string;
  displayName: string;
  expirationTime: Date;
};

// Task
export type CreateTaskInput = {
  name: string;
  status: string;
  dateTimeFinish: string;
  isPublic: boolean;
  description: string;
};

// Business
export type Column = {
  id: Id;
  title: string;
  status: string;
};

export type Task = {
  id: Id;
  name: string;
  status: string;
  isPublic: boolean;
  description: string;
  dateTimeStart: Date;
  dateTimeFinish: Date;
  creatorDisplayName: string;
  priority?: string;
};

export type TaskActivity = {
  id: Id;
  taskId: Id;
  user: string;
  date: Date;
  content: string;
};
