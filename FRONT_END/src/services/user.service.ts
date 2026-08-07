
import { clientAPI } from "../utils/api/api"

export type ChangeAvatarDto = FormData;

export const UserService = {
    async getUser() {
        const response = await clientAPI.get('/user/profile');
        return response.data.data;
    },

    async changeName(newName: string) {
        const response = await clientAPI.patch('/user/change-name', { newName });
        return response.data.data;
    },

    async changePass(oldPass: string, newPass: string) {
        const response = await clientAPI.patch('/user/change-pass', { oldPass, newPass });
        return response.data.data;
    },

    async logOut() {
        const response = await clientAPI.post('auth/logout');
        return response.data.data;
    },

    async changeAvatar(data: ChangeAvatarDto) {
        try {
            const response = await clientAPI.patch('user/change_avatar', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async requireOtpRegainPass(email: string) {
        try {
            const response = await clientAPI.post('auth/forgot-password-otp', { email });
            return response.data.message;
        } catch (error) {
            throw error
        }
    },

    async reGainPassword(body: { email: string, otp: string, newPassword: string }) {
        try {
            const response = await clientAPI.post('auth/forgot-password', body);
            return response.data.message;
        } catch (error) {
            throw error
        }
    },

    async getPost() {
        try {
            const response = await clientAPI.get('user/mypost');
            return response.data.postData;
        } catch (error) {
            console.log('Có lỗi trong quá trình lấy dữ liệu người dùng', error);
            throw error;
        }
    },

    async likePost(postId: number) {
        try {
            const response = await clientAPI.post(`user/like/${postId}`);
            return response.data;
        } catch (error) {
            throw error
        }
    },

    async createComment(postId: number, content: string) {
        try {
            const response = await clientAPI.post(`user/comment/${postId}`, { content });
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    async getComment(postId: number) {
        try {
            const response = await clientAPI.get(`user/comment/${postId}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    async getCommentMyPost(postId: number) {
        try {
            const response = await clientAPI.get(`user/mypost/comment/${postId}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    async getNotification(cursor?: string) {
        try {
            const response = await clientAPI.get('notification/list', {
                params: {
                    limit: 20,
                    cursor: cursor
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async markNotificationAsRead(id: string) {
        try {
            const response = await clientAPI.patch(`notification/read/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async markAllAsRead() {
        try {
            await clientAPI.patch('notification/read-all');
        } catch (error) {
            throw error;
        }
    },

    async deleteAllnotIsReaed () {
        try {
            const response = await clientAPI.delete('notification/delete-all') ;
            return response.data;
        } catch (error) {
            throw error;
        }
    }




}
