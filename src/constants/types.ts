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
  sub: string,
  displayName: string,
  iss: string,
  role: string,
  exp: number,
  iat: number,
}

// export type TokenInfo = {
//   userId: string;
//   displayName: string;
//   expirationTime: Date;
//   role: string;
// };

// Task
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
  isPublic: boolean;
  description: string;
  dateTimeStart: Date;
  dateTimeFinish: Date;
  creatorDisplayName: string;
  assignedUserId: string;
  priority?: string;
};

export type TaskActivity = {
  id: Id;
  taskId: Id;
  user: string;
  date: Date;
  content: string;
};
