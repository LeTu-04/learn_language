import { useEffect, useState } from "react";
import { useAppSelector } from "./hook";
import { clientAPI } from "../utils/api/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface NotifiCationData {
    id: string;
    title: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    postId: number
}
export interface notificationPayload {

}

export function useNotification() {
    // const [notification, setNotifications] = useState<NotifiCationData[]>([]);
    const token = useAppSelector((state) => state.Auth.token);
    const queryClient = useQueryClient();
    useEffect(() => {
        let isCancelled = false;
        if (!token) return;
        let eventSource: EventSource | null = null;
        const connectSSE = async () => {
            try {
                const response = await clientAPI.get('/notification/ticket');
                const ticket = response.data.data;

                if (isCancelled) { return }
                eventSource = new EventSource(`http://localhost:3000/notification/stream?ticket=${ticket}`);
                eventSource.onmessage = (event) => {
                    const newNotify: NotifiCationData = JSON.parse(event.data);
                    //setNotifications((prev) => [newNotify, ...prev]);
                    queryClient.setQueryData(['notifications'], (oldData: any) => {
                        if (!oldData) {
                            return;
                        }
                        const firstPage = oldData.pages[0];
                        const isExists = firstPage?.data?.some((item: any) => item.id === newNotify.id);
                        if (isExists) {
                            return oldData;
                        }
                        const newPages = [...oldData.pages];
                        newPages[0] = {
                            ...newPages[0],
                            data: [newNotify, ...newPages[0].data]
                        }
                        toast.success('Bạn có một thông báo mới')
                        return {
                            ...oldData,
                            pages: newPages
                        }

                    })
                };
                eventSource.addEventListener('ping', (event) => { });
                eventSource.onerror = (err) => {
                    console.log('Lỗi khi kết nối SSE, đang thử kết nối lại', err);
                    eventSource?.close();
                    setTimeout(connectSSE, 5000)
                }

            } catch (error) {
                console.log('Không lấy được ticket', error)
                setTimeout(connectSSE, 5000);
            }
        }

        connectSSE();
        return () => {
            isCancelled = true;
            if (eventSource) {
                eventSource.close();
            }
        }
    }, [token]);
}