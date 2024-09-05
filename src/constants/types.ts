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

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  title: string;
  description: string;
  // add member, create Member type
};

export type TaskActivity = {
  id: Id;
  taskId: Id;
  user: string;
  date: Date;
  content: string;
};
