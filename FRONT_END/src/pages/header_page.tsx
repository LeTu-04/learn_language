import { Search, Heart, Bell, User } from 'lucide-react';
import './css/header.css'
import { useAppDispatch, useAppSelector } from '../hooks/hook';
import type React from 'react';
import { setSearchVocabulary } from "../features/vocabulary/vocabularySlice";

export default function HeaderPage() {


    const dispatch = useAppDispatch();
    const searchValue = useAppSelector((state) => state.Vocabulary.search);
    const handleChangeSearch = (e : React.ChangeEvent<HTMLInputElement>) => {
        dispatch (setSearchVocabulary(e.target.value));
    }

    return (
        <div className="header">
            <div className="header-search-container">
                <Search className="header-search-icon" size={18} />
                <input 
                    type="text" 
                    className="header-search-input" 
                    placeholder="Tìm kiếm từ vựng, chủ đề..." 
                    onChange={handleChangeSearch}
                    value={searchValue}
                />
            </div>

            <div className="header-actions">
                <button className="header-icon-btn" title="Từ vựng yêu thích">
                    <Heart size={20} />
                </button>

                <button className="header-icon-btn" title="Thông báo">
                    <Bell size={20} />
                    <span className="header-notification-dot"></span>
                </button>

                <div className="header-avatar-container">
                    <div className="header-avatar">
                        <User size={20} color="#6b7280" />
                    </div>
                    <div className="header-user-info">
                        {/* <span className="header-username">Học Viên</span>
                        <span className="header-role">Premium ✨</span> */}
                    </div>
                </div>
            </div>
        </div>
    )
}