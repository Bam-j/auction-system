import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {
  Menu, MenuHandler, MenuList, MenuItem,
  Typography, IconButton, Badge, Button
} from '@material-tailwind/react';
import {BellIcon} from '@heroicons/react/24/outline';

import {Notification} from '@/types/notification';

// notification 도메인 내부 api
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
} from '../api/notificationApi';

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // 초기 알림 로드
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    loadNotifications();

    // SSE 구독
    const eventSource = subscribeToNotifications();
    if (eventSource) {
      eventSource.addEventListener('notification', (event: MessageEvent) => {
        try {
          const newNotification: Notification =
              typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          setNotifications((prev) => [newNotification, ...prev]);
        } catch (err) {
          console.error('Failed to parse notification data:', err);
        }
      });

      return () => {
        eventSource.close();
      };
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleReadAll = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({...n, isRead: true})));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // 읽음 처리
    try {
      if (!notification.isRead) {
        await markAsRead(notification.id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === notification.id ? {...n, isRead: true} : n))
        );
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }

    // 이동 및 상품 ID 전달
    // 알림 타입에 따라 적절한 페이지(마이 페이지 탭)로 이동
    let path = '/mypage/products';
    switch (notification.type) {
      case 'PURCHASE_REQUEST_RECEIVED':
        path = '/mypage/requests';
        break;
      case 'PURCHASE_REQUEST_APPROVED':
      case 'PURCHASE_REQUEST_REJECTED':
        path = '/mypage/purchases';
        break;
      case 'INSTANT_BUY_REQUEST_RECEIVED':
      case 'INSTANT_BUY_REQUEST_APPROVED':
      case 'INSTANT_BUY_REQUEST_REJECTED':
        path = '/mypage/instant-buys';
        break;
      case 'OUTBID':
      case 'BID_WON':
        path = '/mypage/bids';
        break;
      case 'AUCTION_EXPIRED':
        path = '/mypage/products';
        break;
      default:
        path = '/mypage/products';
    }

    navigate(path, {
      state: {openProductId: notification.targetId},
    });
  };

  const BellButton = (
      <IconButton variant='text' color='blue-gray' className='rounded-full'>
        <BellIcon className='h-6 w-6'/>
      </IconButton>
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

    if (diff < 60) {
      return '방금 전';
    }
    if (diff < 3600) {
      return `${Math.floor(diff / 60)}분 전`;
    }
    if (diff < 86400) {
      return `${Math.floor(diff / 3600)}시간 전`;
    }
    return `${Math.floor(diff / 86400)}일 전`;
  };

  return (
      <Menu placement='bottom-end'>
        <MenuHandler>
          <div className='cursor-pointer'>
            {unreadCount > 0 ? (
                <Badge content={unreadCount} color='red' withBorder>
                  {BellButton}
                </Badge>
            ) : (
                BellButton
            )}
          </div>
        </MenuHandler>
        <MenuList className='max-h-[400px] w-[320px] p-0 flex flex-col overflow-hidden border-none shadow-xl'>
          <div className='p-4 border-b border-blue-gray-50 bg-white'>
            <div className='flex items-center justify-between'>
              <Typography variant='h6' color='blue-gray' className='font-bold'>
                알림
              </Typography>
              {unreadCount > 0 && (
                  <Typography
                      variant='small'
                      className='text-[10px] text-primary font-bold bg-blue-50 px-2 py-0.5 rounded-full'
                  >
                    {unreadCount}개의 새로운 알림
                  </Typography>
              )}
            </div>
          </div>

          <div className='overflow-y-auto max-h-[300px] py-1'>
            {notifications.length === 0 ? (
                <div className='py-12 text-center flex flex-col items-center gap-2'>
                  <BellIcon className='h-8 w-8 text-blue-gray-100'/>
                  <Typography variant='small' color='blue-gray' className='opacity-50'>
                    새로운 알림이 없습니다.
                  </Typography>
                </div>
            ) : (
                notifications.map((notification) => (
                    <MenuItem
                        key={notification.id}
                        className={`flex flex-col gap-1 p-4 mx-2 my-1 rounded-lg transition-colors ${
                            !notification.isRead
                                ? 'bg-blue-50/40 hover:bg-blue-50/60'
                                : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                    >
                      <div className='flex items-start justify-between gap-2'>
                        <Typography
                            variant='small'
                            className={`font-medium leading-tight ${
                                !notification.isRead ? 'text-primary' : 'text-font-main'
                            }`}
                        >
                          {notification.message}
                        </Typography>
                        {!notification.isRead && (
                            <span className='w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0'/>
                        )}
                      </div>
                      <Typography variant='small' className='text-[11px] text-font-muted'>
                        {formatTime(notification.createdAt)}
                      </Typography>
                    </MenuItem>
                ))
            )}
          </div>

          {unreadCount > 0 && (
              <div className='p-2 border-t border-blue-gray-50 bg-gray-50/30 flex justify-center'>
                <Button
                    variant='text'
                    size='sm'
                    fullWidth
                    className='text-primary hover:bg-blue-50 font-bold py-2'
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
