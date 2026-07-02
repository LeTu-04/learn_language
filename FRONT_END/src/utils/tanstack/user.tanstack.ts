import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UserService, type ChangeAvatarDto } from "../../services/user.service"
import { useAppDispatch, useAppSelector } from "../../hooks/hook"
import toast from "react-hot-toast";
import { logger } from "../../../utils/logger";

import { clearDataAfterLogout, updateAvatar } from "../../features/auth/auth.slice";
import { clearCategoryState } from "../../features/Category/categorySlice";
import { clearVocabularyState } from "../../features/vocabulary/vocabularySlice";
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
            mutationFn: (data: ChangeAvatarDto) =>{
                const promise = UserService.changeAvatar(data);
                toast.promise(promise, {
                    loading : 'Đang thay đổi ảnh đại diện',
                    success : 'Thay đổi ảnh đại diện thành công',
                    error : 'Thay đổi ảnh đại diện thất bại'
                });
                return promise ;
            } ,
            onSuccess: (newAvatarUrl) => {
                //toast.success('Đổi ảnh đại diện thành công!');
                if (newAvatarUrl) {
                    dispatch(updateAvatar(newAvatarUrl));
                }
               // queryClient.invalidateQueries({ queryKey: ['user'] });
            },
            onError: (error: any) => {
              //  toast.error('Có lỗi xảy ra khi cập nhật ảnh!');
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
                dispatch(clearCategoryState());
                dispatch(clearVocabularyState());
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
    },

    getMyPost (enabled : boolean) {
        return useQuery ({
            queryKey : ['user','mypost'] ,
            queryFn : () => UserService.getPost(),
            enabled
        })
    },

    likePost () {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn : (postId : number)=> UserService.likePost(postId),
            onMutate : async(postId : number)=> {
                await queryClient.cancelQueries({queryKey : ['posts']});
                const previousPosts = queryClient.getQueryData(['posts']);
                queryClient.setQueryData(['posts'], (oldData : any) => {
                    if(!oldData) return oldData ;
                    return {
                        ...oldData,
                        pages : oldData.pages.map((page : any)=> ({
                            ...page,
                            postData : page.postData.map((post : any) => {
                                if(post.id === postId) {
                                    const willLike = !post.isLiked;
                                    return {
                                        ...post,
                                        isLiked : willLike,
                                        likecount : {
                                            ...post.likecount,
                                            heartCount: willLike ? post.likecount.heartCount + 1 : Math.max(0, post.likecount.heartCount - 1)
                                        }
                                    }
                                }
                                return post
                            })
                        }))
                    }
                })
                return previousPosts;
            },
            onError : (err, postId, context : any) => {
                if(context?.previousPosts) {
                    queryClient.setQueryData(['posts'], context.previousPosts)
                }
            },
            onSettled : () => {
                
            }
        })
    }



}
