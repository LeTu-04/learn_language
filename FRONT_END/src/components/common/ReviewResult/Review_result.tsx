import { Home, RotateCcw } from "lucide-react";
import './Review_result.css';

interface ReviewResultProps {
    correctCount : number;
    totalCount : number;
    onRetry : ()=> void;
    onGohome : ()=> void;
}

export default function ReviewResult_Component (
    {correctCount, totalCount, onRetry, onGohome} : ReviewResultProps)
{
    // Chống lỗi chia cho 0 nếu totalCount = 0
    const percent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    return (
        <div className="review-result-wrapper">
            <div className="result-card">
                
                <div className="result-header">
                    <div className="icon-wrapper">
                        <span className="emoji">🎉</span>
                    </div>
                    <h2>Hoàn thành!</h2>
                    <p className="subtitle">Tuyệt vời, bạn đã vượt qua bài ôn tập</p>
                </div>

                <div className="score-board">
                    <div className="score-circle">
                        <span className="score-number">
                            {correctCount}
                            <span className="score-divider">/</span>
                            {totalCount}
                        </span>
                    </div>
                    <p className="score-message">Chính xác {percent}%</p>
                </div>

                <div className="result-actions">
                    <button className="btn-secondary" onClick={onRetry}>
                        <RotateCcw size={18} /> Làm lại
                    </button>
                    <button className="btn-primary" onClick={onGohome}>
                         Về trang chủ <Home size={18} />
                    </button>
                </div>
               
            </div>
        </div>
    )
}