import { clientAPI } from "../utils/api/api"

export type ChangeAvatarDto = FormData;

export const UserService = {
    async getUser () {
        const response = await clientAPI.get('/user/profile');
        return response.data.data ;
    },

    async changeName (newName : string) {
        const response = await clientAPI.patch('/user/change-name', {newName});
        return response.data.data ;
    },

    async changePass (oldPass : string, newPass : string) {
        const response = await clientAPI.patch('/user/change-pass', {oldPass, newPass});
        return response.data.data ;
    },

    async logOut () {
        const response = await clientAPI.post('auth/logout');
        return response.data.data;
    },
    
    async changeAvatar (data : ChangeAvatarDto) {
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

    async requireOtpRegainPass (email : string) {
        try {
            const response = await clientAPI.post('auth/forgot-password-otp', {email});
            return response.data.message ;
        } catch (error) {
            throw error
        }
    },

    async reGainPassword (body : {email: string, otp : string, newPassword : string}) {
        try {
            const response = await clientAPI.post('auth/forgot-password', body);
            return response.data.message ;
        } catch (error) {
            throw error
        }
    }
    
}
