import axiosInstance from "@/api/axiosInstance";

//알림 조회
export const fetchNotifications = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};

//알림 한 개 읽음 표시
export const markAsRead = async (notificationId) => {
  const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

//알림 모두 읽음
export const markAllAsRead = async () => {
  const response = await axiosInstance.patch("/notifications/read-all");
  return response.data;
};

//알림 송수신을 위한 연결
export const subscribeToNotifications = () => {
  const authStorage = localStorage.getItem("auth-storage");
  if (!authStorage) {
    console.error("Notification subscribe: No auth-storage found");
    return null;
  }

  const authData = JSON.parse(authStorage);
  let token = authData?.state?.token;

  if (!token) {
    console.error("Notification subscribe: No token found in auth-storage");
    return null;
  }

  if (token.startsWith("Bearer ")) {
    token = token.substring(7);
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
  const subscribeUrl = `${baseUrl}/notifications/subscribe?token=${token}`;
  
  console.log("Notification subscribe attempt:", subscribeUrl);
  const eventSource = new EventSource(subscribeUrl);

  eventSource.onopen = () => {
    console.log("SSE Connection opened");
  };

  eventSource.onerror = (error) => {
    console.error("SSE Connection error:", error);
    eventSource.close();
  };

  return eventSource;
};
