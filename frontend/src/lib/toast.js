import { toast } from "react-toastify";

const showToast = (handler, message) => {
  if (!message) {
    return;
  }
  toast.dismiss();
  handler(message);
};

export const toastSuccess = (message) => showToast(toast.success, message);
export const toastError = (message) => showToast(toast.error, message);
export const toastInfo = (message) => showToast(toast.info, message);
