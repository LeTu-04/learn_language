import { Camera, Mail, User, Settings, Trash2, History } from "lucide-react"
import './profile.component.css'
import React, { useRef, useState } from "react"
import OtpPopup from "../popup/otp_popup"

import Stats from "../stats/stats.component"
import { useSearchParams } from "react-router-dom"


interface UserProps {
    id: string
    name: string
    email: string
    avatarUrl: string | null
    createdAt: string,

    totalVocabLearn: number,
    currentStreak: number,
    longestStreak: number,

}

interface ProfileComponentProps {
    user: UserProps | null | undefined;
    isUploading: boolean;
    onChangeAvatar: (file: File) => void;
    isSetting: boolean
    // onChangeName: (newName: string) => void;
    // onChangePass: (olePass: string, newPass: string) => void;
    // onLogout: () => void;
    // onSubmitOtpAndRegainPassword: (email: string, otp: string, newPassword: string) => void;
    children?: React.ReactNode
}

export default function ProfileComponent({ user, onChangeAvatar, isUploading, isSetting, children }: ProfileComponentProps) {

    const [searchParams, setSearchParams] = useSearchParams();

    const typeSetting = (searchParams.get('tab') || 'settings') as 'settings' | 'trash' | 'history';

    const fileRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isOtpOn, setOtpOn] = useState<boolean>(false);

    const [isDropdownMenu, setIsDropDownMenu] = useState<boolean>(false);
    //  const [typeSetting, setTypeSetting] = useState<'settings' | 'trash' | 'history'>('settings')

    const handleChangFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const file = files[0];
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        onChangeAvatar(file);

    }

    const handleTurnOffOtp = () => {
        setOtpOn(false);
    }




    if (!user) {
        return <div className="user-container">Loading user profile...</div>;
    }
    return (
        <div className="user-container">
            {isOtpOn && <OtpPopup type="regain" email={user.email} handleClickTurnOffOtp={handleTurnOffOtp} />}
            <div className="profile-grid">
                <aside className="user-info">
                    <div className="profile-card user-info-card">
                        {isSetting && <button type="button" className="card-settings-btn" title="Cài đặt" onClick={() => setIsDropDownMenu(!isDropdownMenu)}>
                            <Settings size={18} />
                        </button>}
                        {isDropdownMenu && (
                            <div className="profile-dropdown-setting">
                                <button type="button" className={`dropdown-item ${typeSetting === 'settings' ? 'active' : ''}`} onClick={() => {
                                    setIsDropDownMenu(false);
                                    setSearchParams({tab : 'settings'})
                                }}>
                                    <User /> Cài đặt
                                </button>
                                <button
                                    type="button"
                                    className={`dropdown-item ${typeSetting === 'trash' ? 'active' : ''}`}
                                    onClick={() => {
                                        setSearchParams({tab : 'trash'})
                                        setIsDropDownMenu(false);
                                    }}
                                >
                                    <Trash2 size={14} />
                                    <span>Thùng rác danh mục</span>
                                </button>
                                <button
                                    type="button"
                                    className={`dropdown-item ${typeSetting === 'history' ? 'active' : ''}`}
                                    onClick={() => {
                                        setSearchParams({tab : 'history'})
                                        setIsDropDownMenu(false);
                                    }}
                                >
                                    <History size={14} />
                                    <span>Nhật ký hoạt động</span>
                                </button>
                            </div>
                        )}
                        <div className="avatar-wrapper" onClick={() => fileRef.current?.click()}>
                            <input type="file" hidden accept="image/*" ref={fileRef} onChange={handleChangFile} />
                            {(previewUrl || user.avatarUrl) ? (<img src={previewUrl || user.avatarUrl || undefined} className="avatar-info" alt="Avatar" />)
                                : (<User className="avatar-info" size={48} color="#6b7280" />)}
                            <div className="avatar-hover-overlay">
                                <Camera size={18} color="#ffffff" />
                            </div>
                        </div>
                        <h3 className="profile-user-name"> {(user.name) ? user.name : 'Your name'} </h3>
                        <p className="profile-user-email">
                            <Mail size={14} className="inline-icon" />
                            <span> {user.email} </span>
                        </p>
                    </div>
                    <Stats totalLearnVocab={user.totalVocabLearn} currentStreak={user.currentStreak} longestStreak={user.longestStreak} />
                </aside>

                {children}

            </div>
        </div>

    )
}