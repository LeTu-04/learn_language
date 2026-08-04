import { useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import { Heart, MessageCircle, User } from "lucide-react";
import "react-medium-image-zoom/dist/styles.css";
import CommentInputComponent from "../../commentinput/commentinput";
import { ExpandableText } from "../post/post.component";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../../hooks/hook";


interface PostModalProps {
    post: any;                                                  
    comments: any[];                                            
    avatarPrimaryUser?: string;     
    name? : string;                         
    onClose: () => void;                                       
    onLike: (postId: number) => void;                         
    onPostComment: (postId: number, content: string) => void;   
}

export default function PostModalComponent({
    post,
    comments,
    avatarPrimaryUser,
    name, 
    onClose,
    onLike,
    onPostComment
}: PostModalProps) {

    const email = useAppSelector((state) => state.Auth.user?.email);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="discuss-modal-overlay" onClick={onClose}>
            <div className="discuss-modal-content" onClick={(e) => e.stopPropagation()}>

                <button className="discuss-modal-close" onClick={onClose}>×</button>

                <div className="modal-scroll-container">
                    <div className="discuss-post-card" style={{ boxShadow: 'none', border: 'none', padding: 0, background: 'transparent' }}>
                        <div className="post-meta">
                            <div className="post-avatar">
                                {(post.author?.avatarUrl || avatarPrimaryUser) ? (
                                    <img className="post-avatar-image" src={post.author?.avatarUrl || avatarPrimaryUser} alt="avatar" />
                                ) : (
                                    <User />
                                )}
                            </div>
                            <div className="post-author-info">
                                <span>{post.author?.name || post.author?.email ||  name|| email||   "User"}</span>
                                <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <h4 className="post-title" style={{ marginTop: '12px' }}>{post.title}</h4>
                        <ExpandableText text={post.content} />

                        {post.image_url && (
                            <div className="post-image-container">
                                <Zoom>
                                    <img src={post.image_url} alt="Post attached image" className="post-image" />
                                </Zoom>
                            </div>
                        )}

                        <div className="post-actions">
                            <button className={`post-action-btn ${post.isLiked ? 'liked-btn-active' : ''}`} onClick={() => onLike(post.id)}>
                                <Heart className={`heart-icon ${post.isLiked ? 'heart-active' : ''}`} size={18} color={post.isLiked ? '#ef4444' : 'currentColor'} fill={post.isLiked ? '#ef4444' : 'none'} /> {post.likecount?.heartCount || 0}
                            </button>
                            <button className="post-action-btn">
                                <MessageCircle size={18} /> {post.likecount?.commentCount || 0}
                            </button>
                        </div>
                    </div>

                    {/* Phần 2: Khu vực bình luận (gồm danh sách bình luận + ô nhập) */}
                    <div className="modal-comments-section" style={{ marginTop: '20px', borderTop: '1px solid #edf2f7', paddingTop: '20px' }}>
                        <CommentInputComponent
                            commentText=""
                            comments={comments.map((cmt: any) => ({
                                id: cmt.id,
                                authorId: cmt.authorId,
                                authorName: cmt.author?.name || cmt.author?.email || "User",
                                avatarUrl: cmt.author?.avatarUrl || "",
                                content: cmt.content
                            }))}
                            avatarPrimaryUser={avatarPrimaryUser}
                            onPostComment={(content) => onPostComment(post.id, content)}
                            onCancel={onClose}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
