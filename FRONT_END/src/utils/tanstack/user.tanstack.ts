import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UserService, type ChangeAvatarDto } from "../../services/user.service"
import { useAppDispatch, useAppSelector } from "../../hooks/hook"
import toast from "react-hot-toast";
import { logger } from "../../../utils/logger";

import { clearDataAfterLogout, updateAvatar } from "../../features/auth/auth.slice";
import { useNavigate } from "react-router-dom";

export const UserTanstack = {
    getUser() {
        const initialUser = useAppSelector((state) => state.Auth.user);
        return useQuery({
            queryKey: ['user'],
            queryFn: () => UserService.getUser(),
            //initialData: initialUser || undefined,
            placeholderData : initialUser || undefined,
            staleTime : 0

        })
    },

    changeName() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (newName: string) => UserService.changeName(newName),
            onSuccess: () => {
                toast.success('Thay đổi tên thành công')
                queryClient.invalidateQueries();
            },
            onError: (error) => {
                toast.error('Thay đổi tên không thành công');
                logger.log(error);
            }
        })
    },

    changePassWord() {
        return useMutation({
            mutationFn: ({ oldPass, newPass }: { oldPass: string, newPass: string }) => UserService.changePass(oldPass, newPass),
            onSuccess: () => {
                toast.success('Đổi mật khẩu thành công')
            },
            onError: (error) => {
                toast.error('Đổi mật khẩu thất bại');
                console.log(error.message)
            }
        })
    },

    changeAvatar() {
        const dispatch = useAppDispatch();
        return useMutation({
            mutationFn: (data: ChangeAvatarDto) => UserService.changeAvatar(data),
            onSuccess: (newAvatarUrl) => {
                toast.success('Đổi ảnh đại diện thành công!');
                if (newAvatarUrl) {
                    dispatch(updateAvatar(newAvatarUrl));
                }
               // queryClient.invalidateQueries({ queryKey: ['user'] });
            },
            onError: (error: any) => {
                toast.error('Có lỗi xảy ra khi cập nhật ảnh!');
                console.log(error.message);
            }
        });
    },

    logOut() {
        const dispatch = useAppDispatch()
        const queryClient = useQueryClient();
        const navigate = useNavigate()
        return useMutation({
            mutationFn: () => UserService.logOut(),
            onSuccess: () => {
                queryClient.clear();
                dispatch(clearDataAfterLogout());
                navigate('/login')
            }
        })
    },

    requireOtpRegain() {
        return useMutation({
            mutationFn :(email : string)=>  UserService.requireOtpRegainPass(email),
            onSuccess : () => {
                toast.success('Đã gửi otp đến email của bạn');
            },
            onError : (error)=> {
                toast.error('Gửi OTP thất bại');
                throw error
            }
        });
    },

    RegainPassword () {
        return useMutation({
            mutationFn : (body : {email : string, otp : string, newPassword : string})=> UserService.reGainPassword(body),
            onSuccess : () => {
                toast.success('Thay đổi mật khẩu thành công')
            },
            onError : (error) => {
                toast.error('Thay đổi mật khẩu thất bại')
                throw error;
            }
        })
    }



}
