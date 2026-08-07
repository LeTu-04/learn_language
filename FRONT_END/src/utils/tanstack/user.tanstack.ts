import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UserService, type ChangeAvatarDto } from "../../services/user.service"
import { useAppDispatch, useAppSelector } from "../../hooks/hook"
import toast from "react-hot-toast";
import { logger } from "../../../utils/logger";

import { clearDataAfterLogout, updateAvatar } from "../../features/auth/auth.slice";
import { clearCategoryState } from "../../features/Category/categorySlice";
import { clearVocabularyState } from "../../features/vocabulary/vocabularySlice";
import { data, useNavigate } from "react-router-dom";

export interface notificationData {
    pageParams: [],
    pages: {
        data: {
            isRead: boolean
        }[],
        nextCursor: string
    }[]
}

export const UserTanstack = {
    getUser() {
        const initialUser = useAppSelector((state) => state.Auth.user);
        return useQuery({
            queryKey: ['user'],
            queryFn: () => UserService.getUser(),
            //initialData: initialUser || undefined,
            placeholderData: initialUser || undefined,
            staleTime: 0

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
            mutationFn: (data: ChangeAvatarDto) => {
                const promise = UserService.changeAvatar(data);
                toast.promise(promise, {
                    loading: 'Đang thay đổi ảnh đại diện',
                    success: 'Thay đổi ảnh đại diện thành công',
                    error: 'Thay đổi ảnh đại diện thất bại'
                });
                return promise;
            },
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

    requireOtpRegain(email?: string) {
        return useMutation({
            mutationFn: (email: string) => UserService.requireOtpRegainPass(email),
            onSuccess: () => {
                toast.success('Đã gửi otp đến email của bạn');
            },
            onError: (error) => {
                toast.error('Gửi OTP thất bại');
                throw error
            }
        });
    },

    RegainPassword() {
        return useMutation({
            mutationFn: (body: { email: string, otp: string, newPassword: string }) => UserService.reGainPassword(body),
            onSuccess: () => {
                toast.success('Thay đổi mật khẩu thành công')
            },
            onError: (error) => {
                toast.error('Thay đổi mật khẩu thất bại')
                throw error;
            }
        })
    },

    getMyPost(enabled: boolean) {
        return useQuery({
            queryKey: ['user', 'mypost'],
            queryFn: () => UserService.getPost(),
            enabled
        })
    },

    likePost() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (postId: number) => UserService.likePost(postId),
            onMutate: async (postId: number) => {
                await queryClient.cancelQueries({ queryKey: ['posts'] });
                await queryClient.cancelQueries({ queryKey: ['user', 'mypost'] });
                const previousPosts = queryClient.getQueryData(['posts']);
                const previousMyPosts = queryClient.getQueryData(['user', 'mypost']);
                queryClient.setQueryData(['posts'], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            postData: page.postData.map((post: any) => {
                                if (post.id === postId) {
                                    const willLike = !post.isLiked;
                                    return {
                                        ...post,
                                        isLiked: willLike,
                                        likecount: {
                                            ...post.likecount,
                                            heartCount: willLike ? post.likecount.heartCount + 1 : Math.max(0, post.likecount.heartCount - 1)
                                        }
                                    }
                                }
                                return post
                            })
                        }))
                    }
                });
                queryClient.setQueryData(['user', 'mypost'], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        posts: oldData.posts.map((post: any) => {
                            if (post.id === postId) {
                                const willLike = !post.isLiked;
                                return {
                                    ...post,
                                    isLiked: willLike,
                                    likecount: {
                                        ...post.likecount,
                                        heartCount: willLike ? post.likecount.heartCount + 1 : Math.max(0, post.likecount.heartCount - 1)
                                    }
                                }
                            }
                            return post;
                        })
                    }
                });

                return { previousPosts, previousMyPosts };
            },
            onError: (_err, _postId, context: any) => {
                if (context?.previousPosts) {
                    queryClient.setQueryData(['posts'], context.previousPosts)
                }
                if (context?.previousMyPosts) {
                    queryClient.setQueryData(['user', 'mypost'], context.previousMyPosts)
                }
            },
            onSettled: (_data, _error, postId) => {

            }
        })
    },

    createComment() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ postId, content }: { postId: number; content: string }) =>
                UserService.createComment(postId, content),
            onMutate: async ({ postId, content }) => {
                await queryClient.cancelQueries({ queryKey: ['comments', postId] });
                await queryClient.cancelQueries({ queryKey: ['user', 'mypost'] });
                await queryClient.cancelQueries({ queryKey: ['posts'] });
                const previousComment = queryClient.getQueryData<any[]>(['comments', postId]);
                const previousPosts = queryClient.getQueryData(['posts']);
                const previousMyPosts = queryClient.getQueryData(['user', ['mypost']]);
                const currentUser = queryClient.getQueryData<any>(['user']);
                const mockNewComment = {
                    id: -Date.now(),
                    content: content,
                    createdAt: new Date().toISOString(),
                    author: {
                        id: currentUser?.id || "temp-id",
                        name: currentUser?.name || currentUser?.email,
                        avatarUrl: currentUser?.avatarUrl || null
                    }
                }
                queryClient.setQueryData(['comments', postId], (old: any[] | undefined) => {
                    return old ? [...old, mockNewComment] : [mockNewComment];
                });
                queryClient.setQueryData(['posts'], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            postData: page.postData.map((post: any) => {
                                if (post.id === postId) {
                                    return {
                                        ...post,
                                        likecount: {
                                            ...post.likecount,
                                            commentCount: (post.likecount.commentCount || 0) + 1
                                        }
                                    }
                                }
                                return post;
                            })
                        }))
                    }
                });

                queryClient.setQueryData(['user', 'mypost'], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        posts: oldData.posts.map((post: any) => {
                            if (post.id === postId) {
                                return {
                                    ...post,
                                    likecount: {
                                        ...post.likecount,
                                        commentCount: (post.likecount.commentCount || 0) + 1
                                    }
                                };
                            }
                            return post;
                        })
                    };
                });

                return { previousComment, previousPosts, previousMyPosts }
            },
            onError: (_err, { postId }, context) => {
                if (context?.previousComment) {
                    queryClient.setQueryData(['comments', postId], context.previousComment)
                }
                if (context?.previousPosts) {
                    queryClient.setQueryData(['posts'], context.previousPosts)
                }
                if (context?.previousMyPosts) {
                    queryClient.setQueryData(['user', 'mypost'], context.previousMyPosts)
                }
            },
            onSuccess: (realComment, { postId }) => {
                queryClient.setQueryData(['comments', postId], (old: any[] | undefined) => {
                    if (!old) return [realComment];
                    return old.map(c => c.id < 0 ? realComment : c);
                });
            },
            onSettled: (_data, _error, { postId }) => {

            }
        });
    },

    getComment(postId: number, enabled: boolean) {
        return useQuery({
            queryKey: ['comments', postId],
            queryFn: () => UserService.getComment(postId),
            enabled: enabled && !!postId
        });
    },
    getCommentMyPost(postId: number, enabled: boolean) {
        return useQuery({
            queryKey: ['mypost', 'comment', postId],
            queryFn: () => UserService.getCommentMyPost(postId),
            enabled: enabled
        })
    },

    getNotifications() {
        return useInfiniteQuery({
            queryKey: ['notifications'],
            queryFn: ({ pageParam }) => {
                return UserService.getNotification(pageParam)
            },
            initialPageParam: undefined as string | undefined,
            getNextPageParam: (lastPage) => {
                if (!lastPage || !lastPage.nextCursor) {
                    return undefined;
                } else {
                    return lastPage.nextCursor
                }
            }
        })
    },

    useMarkNotificationAsRead() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (id: string) => UserService.markNotificationAsRead(id),
            onSuccess: (_, id) => {
                queryClient.setQueryData(['notifications'], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            data: page.data.map((notify: any) =>
                                notify.id === id ? { ...notify, isRead: true } : notify
                            )
                        }))
                    };
                });
            }
        });
    },

    makeAllAsRead() {
        const queryCient = useQueryClient();
        return useMutation({
            mutationFn: () => UserService.markAllAsRead(),
            onSuccess: () => {
                queryCient.setQueryData(['notifications'], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            data: page.data.map((notify: any) => ({
                                ...notify,
                                isRead: true
                            }))
                        }))
                    }
                })
            }
        })
    },

    deleteNotIsReaded() {
        const queryCient = useQueryClient();
        return useMutation({
            mutationFn: () => UserService.deleteAllnotIsReaed(),
            onMutate: () => {
                queryCient.cancelQueries({ queryKey: ['notifications'] });
                const previousNotifications = queryCient.getQueryData(['notifications']);
                queryCient.setQueryData(['notifications'], (oldData: notificationData) => {
                    if (!oldData) return;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            data: page.data.filter((not: any) => not.isRead === false)
                        }))
                    }
                });
                return { previousNotifications }
            },
            onError: (_error, _variables, context) => {
                if (context?.previousNotifications) {
                    queryCient.setQueryData(['notifications'], context.previousNotifications);
                }
            },
        })
    }
}
