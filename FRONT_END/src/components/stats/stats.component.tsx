import { BookOpen, Flame } from "lucide-react";

export default function Stats () {
    return (
        
       <div className="profile-card stats-card">
    <h4 className="stats-title">Thống kê học tập</h4>
    <div className="stats-list">
        <div className="stat-item">
            <div className="stat-icon-wrapper blue-glow">
                <BookOpen size={18} color="#3b82f6" />
            </div>
            <div className="stat-info">
                <span className="stat-label">Từ vựng đã học</span>
                <span className="stat-value">1,452</span>
            </div>
        </div>
        <div className="stat-item">
            <div className="stat-icon-wrapper orange-glow">
                <Flame size={18} color="#f97316" />
            </div>
            <div className="stat-info">
                <span className="stat-label">Ngày học liên tục</span>
                <span className="stat-value">28 Ngày</span>
            </div>
        </div>
    </div>
</div> 

    )
}