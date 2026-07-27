import { useNavigate, useSearchParams } from "react-router-dom";
import { ConvertDatetime } from "../../../helper/datetime_helper";
import { UserTanstack } from "../../../utils/tanstack/user.tanstack"
import './notification.component.css';

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
    const { mutate: MarkAllAsReadMutate } = UserTanstack.makeAllAsRead();

    const handleClickMarkAllAsRead = () => {
        MarkAllAsReadMutate();
    }

    if (isLoading) {
        return <p>Đang tải dữ liệu</p>
    }
    if (isError) {
        return <p>Có lỗi trong quá trình lấy dữ liệu</p>
    }
    const notificationList = notData?.pages.flatMap((page) => page.data || []) || [];
    const hasUnread = notificationList.some((item) => item.isRead === false);
    return (
        <div className="notify-popup-container">
            {hasUnread && <button className="mark-all-read-btn" onClick={() => handleClickMarkAllAsRead()} >Mark all as read</button>}
            {
                notificationList.length === 0 ? <p>Không có thông báo nào</p> :
                    notificationList.map((not) => <NotificationItem key={not.id} dataItem={not} />)
            }
        </div>
    )
}


function NotificationItem({ dataItem }: { dataItem: NotificationItemProps }) {
    const navigae = useNavigate();

    const { mutate: makeRead } = UserTanstack.useMarkNotificationAsRead();
    const handleMakeRead = (notificationId: string, postId?: number) => {
        makeRead(notificationId);
        if (postId) {
            navigae(`/course/discuss?postId=${postId}`);
        }

    }

    return (
        <div onClick={() => handleMakeRead(dataItem.id, dataItem.postId)} className={`notification-item ${dataItem.isRead ? 'read' : 'unread'}`} >
            <div className="title-reddot">
                <h4> {dataItem.title} </h4>
                {!dataItem.isRead && <span className="reddot"></span>}
            </div>
            <p> {dataItem.content} </p>
            <span> {ConvertDatetime(dataItem.createdAt)} </span>
        </div>
    )
}