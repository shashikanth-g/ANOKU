import { fetchApi } from "./api";

export const getNotifications = async () => {
  return fetchApi("/notifications");
};

export const markNotificationAsRead = async (id: string) => {
  return fetchApi(`/notifications/${id}/read`, {
    method: "POST",
  });
};
