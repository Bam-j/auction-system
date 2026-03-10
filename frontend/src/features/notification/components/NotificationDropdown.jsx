import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  IconButton,
  Badge,
  Button
} from "@material-tailwind/react";
import {BellIcon} from "@heroicons/react/24/outline";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "새로운 입찰이 등록되었습니다.",
      time: "5분 전",
      isRead: false,
      type: "/mypage/products",
      productId: 1
    },
    {
      id: 2,
      message: "경매가 종료되었습니다.",
      time: "1시간 전",
      isRead: false,
      type: "/mypage/products",
      productId: 2
    },
    {
      id: 3,
      message: "새로운 구매 요청이 들어왔습니다.",
      time: "2시간 전",
      isRead: false,
      type: "/mypage/requests",
      productId: 2
    },
    {
      id: 4,
      message: "상품 등록이 완료되었습니다.",
      time: "5시간 전",
      isRead: true,
      type: "/mypage/products",
      productId: 3
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleReadAll = () => {
    // 알림 목록을 삭제하지 않고, 모든 알림의 isRead 상태를 true로 변경
    setNotifications(prev => prev.map(n => ({...n, isRead: true})));
  };

  const handleNotificationClick = (notification) => {
    // 읽음 처리
    setNotifications(prev =>
        prev.map(n => n.id === notification.id ? {...n, isRead: true} : n)
    );

    // 이동 및 상품 ID 전달
    if (notification.type) {
      navigate(notification.type, {
        state: {openProductId: notification.productId}
      });
    }
  };

  const BellButton = (
      <IconButton variant="text" color="blue-gray" className="rounded-full">
        <BellIcon className="h-6 w-6"/>
      </IconButton>
  );

  return (
      <Menu placement="bottom-end">
        <MenuHandler>
          <div className="cursor-pointer">
            {unreadCount > 0 ? (
                <Badge content={unreadCount} color="red" withBorder>
                  {BellButton}
                </Badge>
            ) : (
                BellButton
            )}
          </div>
        </MenuHandler>
        <MenuList className="max-h-[400px] w-[320px] p-0 flex flex-col overflow-hidden border-none shadow-xl">
          <div className="p-4 border-b border-blue-gray-50 bg-white">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="blue-gray" className="font-bold">
                알림
              </Typography>
              {unreadCount > 0 && (
                  <Typography variant="small" className="text-[10px] text-primary font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                    {unreadCount}개의 새로운 알림
                  </Typography>
              )}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[300px] py-1">
            {notifications.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center gap-2">
                  <BellIcon className="h-8 w-8 text-blue-gray-100" />
                  <Typography variant="small" color="blue-gray" className="opacity-50">
                    새로운 알림이 없습니다.
                  </Typography>
                </div>
            ) : (
                notifications.map((notification) => (
                    <MenuItem
                        key={notification.id}
                        className={`flex flex-col gap-1 p-4 mx-2 my-1 rounded-lg transition-colors ${
                            !notification.isRead ? "bg-blue-50/40 hover:bg-blue-50/60" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Typography
                            variant="small"
                            className={`font-medium leading-tight ${!notification.isRead ? "text-primary" : "text-font-main"}`}
                        >
                          {notification.message}
                        </Typography>
                        {!notification.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                        )}
                      </div>
                      <Typography variant="small" className="text-[11px] text-font-muted">
                        {notification.time}
                      </Typography>
                    </MenuItem>
                ))
            )}
          </div>

          {unreadCount > 0 && (
              <div className="p-2 border-t border-blue-gray-50 bg-gray-50/30 flex justify-center">
                <Button
                    variant="text"
                    size="sm"
                    fullWidth
                    className="text-primary hover:bg-blue-50 font-bold py-2"
                    onClick={handleReadAll}
                >
                  모두 읽음 표시
                </Button>
              </div>
          )}
        </MenuList>
      </Menu>
  );
};

export default NotificationDropdown;
