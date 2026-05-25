import React, {  useState } from "react";
import SideBar from "../../pages/sidebar";
import NavTabs from "../navigation/nav_tabs";
import HeaderPage from "../../pages/header_page";
import { Send, Heart, MessageCircle, Share2, Sparkles, User } from "lucide-react";
import '../../pages/css/addvocab.css';
import './discuss.css';
import { tantackService } from "../../utils/tanstack/tanstackquery";
import Skeleton from "react-loading-skeleton";

export default function Discuss() {
    // UI State cho mock up
    // const [title, setTitle] = useState("");
    // const [content, setContent] = useState("");
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null
    })

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

    const {mutate, isPending : isCreatePostPending} = tantackService.createPost()

    const handleClickPost= () => {
        mutate(formData,
            {
                onSuccess : () => {
                    setFormData({
                        title : '',
                        content : '',
                        image : null
                    })
                }
            }
        )
        
    }

    // Dữ liệu mẫu (UI only)
    // const mockPosts = [
    //     {
    //         id: 1,
    //         author: "Nguyễn Lê Tú",
    //         avatarInitial: "T",
    //         timeAgo: "2 giờ trước",
    //         title: "Chia sẻ lộ trình học từ vựng hiệu quả trong 30 ngày",
    //         content: "Chào mọi người, hôm nay mình muốn chia sẻ phương pháp học từ vựng kết hợp Flashcard và Spaced Repetition (Lặp lại ngắt quãng) mà mình đã áp dụng rất thành công. Thay vì học nhồi nhét, các bạn nên chia nhỏ ra mỗi ngày 10-15 từ và ôn tập lại theo chu kỳ 1 ngày, 3 ngày, 1 tuần...",
    //         likes: 24,
    //         comments: 5,
    //         isLiked: true
    //     },
    //     {
    //         id: 2,
    //         author: "Học Giả Vui Vẻ",
    //         avatarInitial: "H",
    //         timeAgo: "5 giờ trước",
    //         title: "Làm sao để nhớ lâu những từ vựng trừu tượng?",
    //         content: "Mình đang gặp khó khăn với các từ vựng mang tính trừu tượng hoặc học thuật cao. Có bạn nào có tips để ghi nhớ chúng dễ dàng hơn không? Mình đã thử dùng hình ảnh nhưng đôi khi không tìm được hình phù hợp. Xin cảm ơn!",
    //         likes: 12,
    //         comments: 8,
    //         isLiked: false
    //     }
    // ];

    const { data, isPending, isError } = tantackService.usePosts()
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
                        <input type="file" name="file" />
                        <div className="clearfix">
                            <button className="discuss-submit-btn" onClick={handleClickPost} disabled = {isCreatePostPending}>
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

                    {
                        isPending && (
                            <div>
                                <Skeleton count={3} height={50} />
                            </div>
                        )
                    }
                    {/* Danh sách bài viết */}
                    {
                        <div className="discuss-list">
                            {
                                data?.pages.map((post, index) => {
                                    return <React.Fragment key={index}>
                                        {post.postData.map((p) => {
                                            return <div key={p.id} className="discuss-post-card">
                                                <div className="post-meta">
                                                    <div className="post-avatar"> {p.author.avatarUrl ? p.author.avatarUrl : <User/> } </div>
                                                    <div className="posth-author-info">
                                                        <span> {p.author.name ? p.author.name : p.author.email} </span>
                                                        <span className="post-time"> {new Date(p.createdAt).toLocaleDateString()} </span>
                                                    </div>
                                                </div>
                                                <h4 className="post-title"> {p.title} </h4>
                                                <p className="post-content-review"> {p.content} </p>
                                                <div className="post-actions">
                                                    <button className="post-action-btn">
                                                        <Heart size={18}/> Yêu thích
                                                    </button>
                                                    <button className="post-action-btn">
                                                        <MessageCircle size={18}/> Bình luận
                                                    </button>
                                                    <button className="post-action-btn">
                                                        <Share2 size={18}/> Chia sẻ
                                                    </button>
                                                </div>
                                            </div>
                                        })}
                                    </React.Fragment>
                                })
                            }
                        </div>
                    }


                    {/* <div className="discuss-list">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2d3748', marginBottom: '12px' }}>
                            Thảo luận nổi bật
                        </h3>
                        
                        {mockPosts.map(post => (
                            <div key={post.id} className="discuss-post-card">
                                <div className="post-meta">
                                    <div className="post-avatar">{post.avatarInitial}</div>
                                    <div className="post-author-info">
                                        <span className="post-author">{post.author}</span>
                                        <span className="post-time">{post.timeAgo}</span>
                                    </div>
                                </div>
                                <h4 className="post-title">{post.title}</h4>
                                <p className="post-content-preview">{post.content}</p>
                                
                                <div className="post-actions">
                                    <button className={`post-action-btn ${post.isLiked ? 'active' : ''}`}>
                                        <Heart size={18} fill={post.isLiked ? "#f64f59" : "none"} />
                                        {post.likes} Yêu thích
                                    </button>
                                    <button className="post-action-btn">
                                        <MessageCircle size={18} />
                                        {post.comments} Bình luận
                                    </button>
                                    <button className="post-action-btn">
                                        <Share2 size={18} />
                                        Chia sẻ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div> */}

                </div>
            </div>

            {/* Panel trống ở bên phải (nếu bạn muốn tận dụng không gian grid) */}
            <div style={{ gridArea: 'right' }}></div>
        </div>
    )
}