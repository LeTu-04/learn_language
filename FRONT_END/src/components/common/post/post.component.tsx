import { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import { Heart, MessageCircle } from 'lucide-react'
import 'react-medium-image-zoom/dist/styles.css'
import './post.component.css'
import { Navigate, useNavigate } from 'react-router-dom'

interface postProps {
    id: number,
    title: string,
    content: string,
    image_url: string,
    createdAt: string
}

interface postDataProps {
    posts: postProps[],
    avatarUrl: string,
    name: string
}

export function ExpandableText({ text, maxLength = 180 }: { text: string; maxLength?: number }) {

    const [isExpanded, setIsExpanded] = useState(false);

    if (text.length <= maxLength) {
        return <p className="post-content">{text}</p>;
    }

    return (
        <p className="post-content">
            {isExpanded ? text : `${text.slice(0, maxLength)}... `}
            <button
                type="button"
                className="toggle-expand-btn"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? 'Ẩn bớt' : 'Xem thêm'}
            </button>
        </p>
    );
}

export default function PostComponent({ posts, avatarUrl, name }: postDataProps) {
    const navigate = useNavigate()
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    }

    if(posts.length === 0) return (
        <div className='post-container'>
            <div className='no-posts-card'>
                <div className='no-posts-icon-wrapper'>
                    <MessageCircle size={32} className='no-posts-icon' />
                </div>
                <h3 className='no-posts-title'>Chưa có bài viết nào</h3>
                <p className='no-posts-subtitle'>Hãy chia sẻ những suy nghĩ, câu hỏi hoặc kinh nghiệm học tập của bạn cùng mọi người nhé!</p>
                <button className='no-posts-action-btn' type='button' onClick={() => navigate('/course/discuss')}>
                    <span>Chia sẻ cảm nghĩ</span>
                </button>
            </div>
        </div>
    )

    return (
        <div className="post-container">
            {
                posts.map((p) => (
                    <div className="each-post-container" key={p.id}>
                        {/* Header: Avatar + Tên + Ngày đăng */}
                        <div className="post-header">
                            <div className="image-wrapper">
                                <img src={avatarUrl} alt="avatar" />
                            </div>
                            <div className="post-meta">
                                <h4 className="post-author-name">{name}</h4>
                                <span className="post-date">{formatDate(p.createdAt)}</span>
                            </div>
                        </div>

                        {/* Body: Tiêu đề + Nội dung + Ảnh đính kèm (nếu có) */}
                        <div className="post-body">
                            {p.title && <h3 className="post-title">{p.title}</h3>}
                            <ExpandableText text={p.content} />
                            {p.image_url && (
                                <div className="post-image-preview">
                                    <Zoom>
                                        <img src={p.image_url} alt="post-img" />
                                    </Zoom>
                                </div>
                            )}
                        </div>
                        {/* Actions: Thích & Bình luận */}
                        <div className="post-actions">
                            <button className="post-action-btn" type="button">
                                <Heart size={18} />
                                <span>Thích</span>
                            </button>
                            <button className="post-action-btn" type="button">
                                <MessageCircle size={18} />
                                <span>Bình luận</span>
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}