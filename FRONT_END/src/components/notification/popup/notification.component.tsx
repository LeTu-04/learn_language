import { UserTanstack } from "../../../utils/tanstack/user.tanstack"
import  './notification.component.css';

export interface NotificationItemProps {
    id: string,
    title: string,
    content: string,
    isRead: boolean,
    createdAt: string,
    postId: number
}

export interface NotificationComponentProps {
    Notificationsdata: NotificationItemProps[]
}

export default function NotificationPopupComponent() {

    const { data: notData, hasNextPage, fetchNextPage, isLoading, isError } = UserTanstack.getNotifications();
    if (isLoading) {
        return <p>Đang tải dữ liệu</p>
    }
    if (isError) {
        return <p>Có lỗi trong quá trình lấy dữ liệu</p>
    }
    const notificationList = notData?.pages.flatMap((page) => page.data || []) || [];
    return (
        <div className="notify-popup-container">
            {
                notificationList.length === 0 ? <p>Không có thông báo nào</p> :
                    notificationList.map((not) => <NotificationItem key={not.id} dataItem={not} />)
            }
        </div>
    )
}


function NotificationItem({ dataItem }: { dataItem: NotificationItemProps }) {
    return (
        <div className={`notification-item ${dataItem.isRead ? 'read' : 'unread'}`} >
            <h4> {dataItem.title} </h4>
            <p> {dataItem.content} </p>
        </div>
    )
}