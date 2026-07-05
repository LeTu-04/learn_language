import { Delete, Send, User } from "lucide-react";
import { useState } from "react";

import './commentinput.css'

export interface commentsProps {
    id : number,
    authorId : string,
    authorName : string,
    avatarUrl : string,
    content : string
}

export interface commentInputProps {
    onPostComment : (comment : string) => void ;
    onCancel : () => void;
  //  postId : number;
    commentText : string;
    comments :  commentsProps[],
    avatarPrimaryUser : string | undefined
}

export default function CommentInputComponent({onPostComment, onCancel, commentText, comments, avatarPrimaryUser } : commentInputProps) {

    const [comment, setComment] = useState<string>('');
   
    
    const handleClickSendComment = () => {
        if(comment.length === 0) return ;
        onPostComment(comment);
        setComment('');
    }
    return (
        <div className="container-comment-input">
            <div className="container-user-comment">
                {comments.map((cmt) => {
                    return <div className="each-user-comment" key={cmt.id}>
                        <div className="wrapper-avatar">
                            {cmt.avatarUrl ? <img src={cmt.avatarUrl} alt="avatar" /> : <User/> }
                        </div>
                        <div className="right-comment">
                            <p className="comment-name"> {cmt.authorName} </p>
                            <p className="comment-content"> {cmt.content} </p>
                        </div>
                    </div>
                })}
            </div>
            <div className="container-input-action">
                <div className="wrapper-avatar-comment">
                    {avatarPrimaryUser ? <img src={avatarPrimaryUser} alt="avatar" /> : <User/>}
                </div>
                <div className="right-action-input">
                    <input type="text" placeholder="viết bình luận..." onChange={(e)=> setComment(e.target.value)} value={comment} />
                    <button type="button" onClick={onCancel}>
                        <Delete/>
                    </button>
                    <button type="button" onClick={handleClickSendComment}>
                        <Send/> 
                    </button>
                </div>
            </div>
        </div>
    )
}