import { BookPlus, Layers, RefreshCw, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './nav_tabs.css';

const navItems = [
    { path: '/course/add_vocab', label: 'Từ vựng', icon: BookPlus },
    { path: '/course/flashcard', label: 'Flash Card', icon: Layers },
    { path: '/course/review', label: 'Ôn tập', icon: RefreshCw },
    { path: '/course/discuss', label: 'Thảo luận', icon: MessageCircle },
];

export default function NavTabs() {
    const navigate = useNavigate();
    const params = useParams();

    // cho biết url của trang 
//     Nếu URL hiện tại là http://localhost:5173/course/add_vocab?category=5#section1:

// ts
// {
//     pathname: "/course/add_vocab",    // Đường dẫn
//     search:   "?category=5",          // Query string
//     hash:     "#section1",            // Hash
//     state:    null,                    // Dữ liệu ẩn truyền qua navigate()
//     key:      "default"               // Key nội bộ của React Router
// }
    const location = useLocation();

    return (
        <nav className="nav-tabs">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <button
                        key={item.path}
                        className={`nav-tab ${isActive ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <item.icon size={14} />
                        <span>{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
