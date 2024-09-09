import { jwtDecode } from "jwt-decode";
import { UserInfo } from "src/constants/types";

export const generateId = () => {
  return Math.floor(Math.random() * 10001);
};

export function generateUniqueId(prefix: string = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`;
}

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  return date.toLocaleDateString("en-US", options);
};

export const formatDueDate = (date: string): string => {
  const onlyDate = date.split("T")[0];
  const formatedDate = onlyDate.split("-").reverse();
  return formatedDate.join("-");
};

export const decodeToken = (token: string): UserInfo => {
  const userInfo = jwtDecode<UserInfo>(token);
  return userInfo;
};
