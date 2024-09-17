export type Id = string;

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

// // decode from jwt token
export type UserInfo = {
  sub: string;
  displayName: string;
  iss: string;
  role: string;
  exp: number;
  iat: number;
};

// export type TokenInfo = {
//   userId: string;
//   displayName: string;
//   expirationTime: Date;
//   role: string;
// };

// Task
export type SearchTaskInput = {
  userId: string;
  creatorDisplayName: string;
  taskName: string;
};

export type CreateTaskInput = {
  name: string;
  status: string;
  dateTimeFinish: string;
  isPublic: boolean;
  description: string;
};

export type UpdateTaskInput = {
  name: string;
  status: string;
  dateTimeFinish: string;
  isPublic: boolean;
  description: string;
  assignedUserId?: string;
};

export type MoveTaskInput = {
  taskId: string;
  startPosition: number;
  overPosition: number;
  startStatus: string;
  overStatus: string;
};

// Business
export type Column = {
  id: Id;
  title: string;
  status: string;
};

export type Task = {
  id: string;
  name: string;
  status: string;
  position: number;
  isPublic: boolean;
  description: string;
  dateTimeStart: Date;
  dateTimeFinish: Date;
  creatorDisplayName: string;
  priority?: string;
  assignedUserId: string;
  assignedUserDisplayName: string;
};

export type Image = {
  id: string;
  imageUrl: string;
  taskId: string;
};

export type TaskActivity = {
  id: Id;
  taskId: Id;
  user: string;
  date: Date;
  content: string;
};
