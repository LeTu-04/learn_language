import React, { useEffect, useState } from "react";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { Send, Heart, MessageCircle, Share2, Sparkles, User, Image as ImageIcon, Plus } from "lucide-react";
import '../../pages/css/addvocab.css';
import './discuss.css';
import { tantackService } from "../../utils/tanstack/tanstackquery";
import Skeleton from "react-loading-skeleton";
import { ExpandableText } from "../common/post/post.component";

import { useInView } from 'react-intersection-observer';
import toast from "react-hot-toast";
import { UserTanstack } from "../../utils/tanstack/user.tanstack";
import CommentInputComponent from "../commentinput/commentinput";
import { useAppSelector } from "../../hooks/hook";
import PostModalComponent from "../common/post_modal/post_modal";
import { useSearchParams } from "react-router-dom";



export default function Discuss() {

    const [searchParam] = useSearchParams();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        file: null as File | null
    });


    const [activePostId, setActivePostId] = useState<number | null>(null);
    const targetPostId = Number(searchParam.get('postId'));

    const { data: commentsData } = UserTanstack.getComment(activePostId || 0, !!activePostId);




    const handleToggleComment = (postId: number) => {
        if (postId === activePostId) {
            setActivePostId(null);
        } else {
            setActivePostId(postId);
        }
    };
    const { mutate: likePostMutate, isPending: likePostPending } = UserTanstack.likePost();

    const primaryUserAvatar = useAppSelector((state) => state.Auth.user?.avatarUrl);


    const handleChangeFormData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, type, value } = e.target;

        const inputValue = type === 'file'
            ? (e.target as HTMLInputElement).files?.[0]
            : value;

        setFormData((prev) => ({
            ...prev,
            [name]: inputValue
        }));

        console.log(formData);
    }

    const { mutate, isPending: isCreatePostPending } = tantackService.createPost()

    const [isMobileCreateOpen, setIsMobileCreateOpen] = useState<boolean>(false);

    const handleClickPost = () => {
        const newformData = new FormData();
        const titleTrimmed = formData.title.trim();
        const contentTrimmed = formData.content.trim();

        if (titleTrimmed.length > 100) {
            toast.error('Tiêu đề không được dài quá 100 ký tự!');
            return;
        }
        if (contentTrimmed.length > 5000) {
            toast.error('Nội dung bài viết không được dài quá 5000 ký tự!');
            return;
        }
        newformData.append('title', formData.title);
        newformData.append('content', formData.content);

        if (formData.file) {
            newformData.append('file', formData.file);
        }
        mutate(newformData,
            {
                onSuccess: () => {
                    setFormData({
                        title: '',
                        content: '',
                        file: null
                    });
                    setIsMobileCreateOpen(false);
                }
            }
        )

    }


    const { data, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = tantackService.usePosts()
    const activePost = data?.pages.flatMap((page) => page.postData).find((post) => post.id === activePostId);

    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const handleClickLikePost = (postId: number) => {
        likePostMutate(postId)
    }

    const { mutate: createCommentMutate } = UserTanstack.createComment();
    const handleCreateComment = (postId: number, content: string) => {
        createCommentMutate({ postId, content });
    };

    useEffect(() => {
        if (targetPostId) {
            const postElement = document.getElementById(`post-${targetPostId}`);
            postElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            postElement?.classList.add('hightlight-post');
            const timer = setTimeout(() => {
                postElement?.classList.remove('hightlight-post')
            }, (2000));
            setActivePostId(targetPostId);
            return () => clearTimeout(timer);
        }
    }, [targetPostId])

    return (
        <div className={`layout sidebarclose`}>

           
            <button type="button" className="mobile-discuss-fab" onClick={() => setIsMobileCreateOpen(true)}>
                <Plus size={18} />
                <span>Đăng bài</span>
            </button>

        
            {isMobileCreateOpen && (
                <div className="mobile-discuss-backdrop" onClick={() => setIsMobileCreateOpen(false)} />
            )}

            <div className="main-content-discuss">
                <div className="discuss-container">

                    {/* Form tạo bài viết mới */}
                    <div className={`discuss-form-card ${isMobileCreateOpen ? 'mobile-open' : ''}`}>
                        <div className="discuss-mobile-header">
                            <div className="discuss-header" style={{ margin: 0 }}>
                                Tạo cuộc thảo luận mới
                            </div>
                            <button type="button" className="discuss-close-btn" onClick={() => setIsMobileCreateOpen(false)}>
                                ×
                            </button>
                        </div>
                        <input
                            type="text"
                            name="title"
                            maxLength={100}
                            className="discuss-input"
                            placeholder="Chủ đề bạn muốn thảo luận là gì?"
                            value={formData.title}
                            onChange={handleChangeFormData}
                        />
                        <textarea
                            name="content"
                            maxLength={5000}
                            className="discuss-textarea"
                            placeholder="Chia sẻ suy nghĩ, câu hỏi hoặc kiến thức của bạn tại đây..."
                            value={formData.content}
                            onChange={handleChangeFormData}
                        ></textarea>
                        <input
                            type="file"
                            id="discuss-file-input"
                            name="file"
                            accept="image/*"
                            onChange={handleChangeFormData}
                            style={{ display: 'none' }}
                        />
                        <div className="discuss-upload-container">
                            <label htmlFor="discuss-file-input" className="discuss-upload-label">
                                <ImageIcon size={18} />
                                <span>{formData.file ? 'Thay đổi ảnh' : 'Thêm hình ảnh'}</span>
                            </label>
                            {formData.file && (
                                <div className="discuss-image-preview">
                                    <img src={URL.createObjectURL(formData.file)} alt="Preview" />
                                    <button type="button" className="remove-image-btn" onClick={() => setFormData(prev => ({ ...prev, file: null }))}>×</button>
                                </div>
                            )}
                        </div>
                        <div className="clearfix">
                            <button className="discuss-submit-btn" onClick={handleClickPost} disabled={isCreatePostPending}>
                                <Send size={18} />
                                {isCreatePostPending ? 'Đang đăng' : 'Đăng bài'}
                            </button>
                        </div>
                    </div>




                    {isError && (
                        <div>
                            Có lỗi trong quá trình tải dữ liệu
                        </div>
                    )}

                    {isPending && (
                        <div>
                            <Skeleton count={3} height={50} />
                        </div>
                    )}

                    {/* Danh sách bài viết */}
                    <div className="discuss-list">
                        {data?.pages.map((post, index) => {
                            return <React.Fragment key={index}>
                                {post.postData.map((p) => {
                                    return <div key={p.id} id={`post-${p.id}`} className="discuss-post-card">
                                        <div className="post-meta">
                                            <div className="post-avatar"> {p.author.avatarUrl ? <img className="post-avatar-image" src={p.author.avatarUrl} /> : <User size={20} />} </div>
                                            <div className="post-author-info">
                                                <span className="post-author-name"> {p.author.name ? p.author.name : p.author.email} </span>
                                                <span className="post-time"> {new Date(p.createdAt).toLocaleDateString()} </span>
                                            </div>
                                        </div>
                                        <h4 className="post-title"> {p.title} </h4>
                                        <ExpandableText text={p.content} />
                                        {p.image_url && (
                                            <div className="post-image-container">
                                                <Zoom>
                                                    <img src={p.image_url} alt="Post attached image" className="post-image" />
                                                </Zoom>
                                            </div>
                                        )}
                                        <div className="post-actions">
                                            <button className={`post-action-btn ${p.isLiked ? 'liked-btn-active' : ''}`} onClick={() => handleClickLikePost(p.id)}>
                                                <Heart className={`heart-icon ${p.isLiked ? 'heart-active' : ''}`} size={18} color={p.isLiked ? '#ef4444' : 'currentColor'} fill={p.isLiked ? '#ef4444' : 'none'} /> {p.likecount.heartCount}
                                            </button>
                                            <button className="post-action-btn" onClick={() => handleToggleComment(p.id)}>
                                                <MessageCircle size={18} /> {p.likecount.commentCount}
                                            </button>

                                        </div>



                                    </div>


                                })}
                            </React.Fragment>
                        })}


                        <div ref={ref} style={{ textAlign: 'center', padding: '20px' }}>
                            {isFetchingNextPage ? 'Đang tải thêm...' : ''}
                        </div>
                    </div>

                </div>
            </div>

            {activePost && (
                <PostModalComponent
                    post={activePost}
                    comments={commentsData || []}
                    avatarPrimaryUser={primaryUserAvatar || undefined}
                    onClose={() => setActivePostId(null)}
                    onLike={handleClickLikePost}
                    onPostComment={handleCreateComment}
                />
            )}

            <div style={{ gridArea: 'right' }}></div>
        </div>
    );
}




