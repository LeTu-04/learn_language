import React, { useEffect, useState } from "react";
import SideBar from "../../pages/sidebar";
import NavTabs from "../navigation/nav_tabs";
import HeaderPage from "../../pages/header_page";
import { Send, Heart, MessageCircle, Share2, Sparkles, User } from "lucide-react";
import '../../pages/css/addvocab.css';
import './discuss.css';
import { tantackService } from "../../utils/tanstack/tanstackquery";
import Skeleton from "react-loading-skeleton";

import { useInView } from 'react-intersection-observer';


export default function Discuss() {

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        file: null as File | null
    });

    const [isSidebarOpen, setIsSideBarOpen] = useState(true);

    // const handleToogleSideBar = () => {
    //     setIsSideBarOpen(!isSidebarOpen);
    // }


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

    const handleClickPost = () => {
        const newformData = new FormData();


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
                    })
                }
            }
        )

    }


    const { data, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = tantackService.usePosts()

    // Lưu ý: inView phải viết hoa chữ V
    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    return (
        <div className={`layout ${isSidebarOpen ? "sidebaropen" : "sidebarclose"}`}>
            <SideBar showAddCategory={false} />
            <HeaderPage />
            <NavTabs />

            <div className="main-content-discuss">
                <div className="discuss-container">

                    {/* Form tạo bài viết mới */}
                    <div className="discuss-form-card">
                        <div className="discuss-header">
                            <Sparkles className="text-yellow-500" size={24} color="#f59e0b" />
                            Tạo cuộc thảo luận mới
                        </div>
                        <input
                            type="text"
                            name="title"
                            className="discuss-input"
                            placeholder="Chủ đề bạn muốn thảo luận là gì?"
                            value={formData.title}
                            onChange={handleChangeFormData}
                        />
                        <textarea
                            name="content"
                            className="discuss-textarea"
                            placeholder="Chia sẻ suy nghĩ, câu hỏi hoặc kiến thức của bạn tại đây..."
                            value={formData.content}
                            onChange={handleChangeFormData}
                        ></textarea>
                        <input type="file" name="file" onChange={handleChangeFormData} />
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
                                    return <div key={p.id} className="discuss-post-card">
                                        <div className="post-meta">
                                            <div className="post-avatar"> {p.author.avatarUrl ? <img className="post-avatar-image" src={p.author.avatarUrl} /> : <User />} </div>
                                            <div className="posth-author-info">
                                                <span> {p.author.name ? p.author.name : p.author.email} </span>
                                                <span className="post-time"> {new Date(p.createdAt).toLocaleDateString()} </span>
                                            </div>
                                        </div>
                                        <h4 className="post-title"> {p.title} </h4>
                                        <p className="post-content-review"> {p.content} </p>
                                        {p.image_url && (
                                            <div className="post-image-container">
                                                <img src={p.image_url} alt="Post attached image" className="post-image" />
                                            </div>
                                        )}
                                        <div className="post-actions">
                                            <button className="post-action-btn">
                                                <Heart size={18} /> Yêu thích
                                            </button>
                                            <button className="post-action-btn">
                                                <MessageCircle size={18} /> Bình luận
                                            </button>
                                            <button className="post-action-btn">
                                                <Share2 size={18} /> Chia sẻ
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

            <div style={{ gridArea: 'right' }}></div>
        </div>
    )
}