import { toast } from "react-toastify";

export type NotificationType = "success" | "error" | "warning";

export const showNotification = (type: NotificationType, message: string) => {
  if (type === "success") {
    toast.success(message, { position: "top-right" });
  }
  if (type === "error") {
    toast.error(message, { position: "top-right" });
  }
  if (type === "warning") {
    toast.warning(message, { position: "top-right" });
  }
};
