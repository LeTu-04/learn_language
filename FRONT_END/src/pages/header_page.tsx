import { Search, Heart, Bell, User } from 'lucide-react';
import './css/header.css'
import { useAppDispatch, useAppSelector } from '../hooks/hook';
import type React from 'react';
import { setSearchVocabulary } from "../features/vocabulary/vocabularySlice";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NotificationPopupComponent from '../components/notification/popup/notification.component';

interface ShowSearchProps {
    showSearch?: boolean
}


export default function HeaderPage({ showSearch }: ShowSearchProps) {

    const [searchParams, setSearchParams] = useSearchParams();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isNotificationAreOn, setNotification] = useState<boolean>(false);

    const isFavorite = searchParams.get('view') === 'favorite';

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.Auth.user);
    const searchValue = useAppSelector((state) => state.Vocabulary.search);

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchVocabulary(e.target.value));
    }

    const handleClickAvatar = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    }



    useEffect(() => {
        if (!isMenuOpen) return;
        const closeMenu = () => setIsMenuOpen(false);
        window.addEventListener('click', closeMenu)
        return () => window.removeEventListener('click', closeMenu);
    }, [isMenuOpen])




    return (
        <div className="header">
            {isNotificationAreOn && <NotificationPopupComponent />}
            <div className='header-left'>
                <div className="header-logo" onClick={() => navigate('/home')} title="Về trang chủ">
                    <span className="logo-text">L4</span>
                </div>

                {showSearch && <div className="header-search-container">
                    <Search className="header-search-icon" size={18} />
                    <input
                        type="text"
                        className="header-search-input"
                        placeholder="Tìm kiếm từ vựng, chủ đề..."
                        onChange={handleChangeSearch}
                        value={searchValue}
                    />
                </div>
                }
            </div>

            <div className="header-actions">
                <div className={`header-favorite-wrapper ${isFavorite ? 'is-active' : ''}`}>
                    <button
                        type="button"
                        className="header-favorite-btn"
                        title="Từ vựng yêu thích"
                        onClick={() => setSearchParams(isFavorite ? {} : { view: 'favorite' })}
                    >
                        <Heart size={20} />
                    </button>
                    <button
                        type="button"
                        className="header-favorite-back-btn"
                        title="Quay lại học tập"
                        onClick={() => setSearchParams({})}
                    >
                        Quay lại
                    </button>
                </div>

                <button className="header-icon-btn" title="Thông báo" onClick={(e) => {
                    e.stopPropagation();
                    setNotification(!isNotificationAreOn)
                }} >
                    <Bell size={20} />
                    <span className="header-notification-dot"></span>
                </button>

                <div className="header-avatar-container" onClick={handleClickAvatar}>
                    <div className="header-avatar">
                        {user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" /> : <User size={20} color="#6b7280" />}
                    </div>
                    <div className="header-user-info">
                        <span className="header-username"> {user?.name} </span>
                    </div>
                    {isMenuOpen && (
                        <div className='header-dropdown-menu' onClick={(e) => e.stopPropagation()}>
                            <button type='button' onClick={() => {
                                setIsMenuOpen(false);
                                navigate('/profile')
                            }}>
                                Xem trang cá nhân
                            </button>
                            <button type='button' onClick={() => {
                                navigate('/profile?tab=settings');
                                setIsMenuOpen(false);
                            }}>
                                Cài đặt
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}