export type NotificationType =
  | 'PURCHASE_REQUEST_RECEIVED'
  | 'PURCHASE_REQUEST_APPROVED'
  | 'PURCHASE_REQUEST_REJECTED'
  | 'INSTANT_BUY_REQUEST_RECEIVED'
  | 'INSTANT_BUY_REQUEST_APPROVED'
  | 'INSTANT_BUY_REQUEST_REJECTED'
  | 'OUTBID'
  | 'BID_WON'
  | 'AUCTION_EXPIRED';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  targetId: number;
  isRead: boolean;
  createdAt: string;
}
