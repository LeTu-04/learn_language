import { Camera, Key, Lock, LogOut, Mail, RefreshCw, User, Settings, Trash2, History } from "lucide-react"
import './profile.component.css'
import React, { useRef, useState } from "react"
import OtpPopup from "../popup/otp_popup"

import { UserTanstack } from "../../utils/tanstack/user.tanstack"
import { useAppSelector } from "../../hooks/hook"
import Stats from "../stats/stats.component"

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
    onChangeName: (newName: string) => void;
    onChangePass: (olePass: string, newPass: string) => void;
    onLogout: () => void;
    onSubmitOtpAndRegainPassword: (email: string, otp: string, newPassword: string) => void;
}

export default function ProfileComponent({ user, onChangeName, onChangePass, onLogout, onChangeAvatar, isUploading, onSubmitOtpAndRegainPassword }: ProfileComponentProps) {
    const email = useAppSelector((state) => state.Auth.user?.email);

    const [name, setName] = useState<string>('');

    const [oldPass, setOldPass] = useState<string>('');
    const [newPass, setNewPass] = useState<string>('');

    const fileRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isOtpOn, setOtpOn] = useState<boolean>(false);

    const [isDropdownMenu, setIsDropDownMenu] = useState<boolean>(false);
    const [typeSetting, setTypeSetting] = useState<'settings'| 'trash' | 'history' >('settings')

    const { mutate: requireOtpMutate } = UserTanstack.requireOtpRegain()

    const handleChangeName = (value: string) => {
        setName(value)
    }
    const handleSubmitChangeName = () => {
        if (name.trim()) {
            onChangeName(name);
            setName("")
        }
    }
    const handleKeydownChangeName = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmitChangeName()
        }
    }
    const handleOnChangeOldPass = (value: string) => {
        setOldPass(value)
    }
    const handleOnChangeNewPass = (value: string) => {
        setNewPass(value)
    }
    const handleChangePassword = () => {
        if (oldPass && newPass) {
            onChangePass(oldPass, newPass);
            setOldPass("");
            setNewPass("")
        }
    }
    const handleKeydownChangePassword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleChangePassword()
        }
    }
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

    const handleRegainPassword = () => {
        setOtpOn(true);
        requireOtpMutate(email!);

    }

    const handleLogout = () => {
        onLogout();
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
                        <button type="button" className="card-settings-btn" title="Cài đặt" onClick={()=> setIsDropDownMenu(!isDropdownMenu)}>
                            <Settings size={18} />
                        </button>
                        {isDropdownMenu && (
                            <div className="profile-dropdown-setting">
                                <button type="button" className={`dropdown-item ${typeSetting === 'settings'? 'active' : ''}`} onClick={()=> {setIsDropDownMenu(false);
                                    setTypeSetting('settings')
                                }}> 
                                    <User/> Cài đặt
                                </button>
                                <button 
                type="button" 
                className={`dropdown-item ${typeSetting === 'trash' ? 'active' : ''}`}
                onClick={() => {
                    setTypeSetting('trash');   
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
                    setTypeSetting('history');  
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
                <main className="action-change-info">
                    <div className="profile-card settings-card">

                        <h3 className="setting-title"> Cài đặt tài khoản</h3>
                        {/* Thay tên */}
                        <div className="setting-section">
                            <h4 className="section-label"> Thông tin cá nhân</h4>
                            <div className="action-change-name">

                                <div className="input-with-icon">
                                    <User size={18} className="input-icon" />
                                    <input type="text" placeholder="Your name..." value={name} onChange={(e) => handleChangeName(e.target.value)} onKeyDown={handleKeydownChangeName}>
                                    </input>
                                </div>
                                <button type="button" onClick={handleSubmitChangeName} className="btn-save-name">
                                    Lưu
                                </button>
                            </div>
                        </div>
                        {/** Đổi mật khẩu */}
                        <div className="setting-section">
                            <h4 className="section-label">Bảo mật</h4>
                            <div className="action-change-password">
                                <div className="input-with-icon">
                                    <Lock size={18} className="input-icon" />
                                    <input type="password" name="changepass" value={oldPass} placeholder="Nhập mật khẩu cũ" onChange={(e) => handleOnChangeOldPass(e.target.value)} autoComplete="new-password" />


                                </div>
                                <div className="input-with-icon">
                                    <Key size={18} className="input-icon" />
                                    <input type="password" name="changepass" value={newPass} placeholder="Nhập mật khẩu mới" onChange={(e) => handleOnChangeNewPass(e.target.value)} onKeyDown={handleKeydownChangePassword} autoComplete="new-password" />
                                </div>
                                <button type="button" onClick={handleChangePassword} className="btn-change-pass">Đổi mật khẩu</button>
                            </div>
                        </div>

                        {/**Nút quên mật khẩu và logout */}
                        <div className="setting-section action-buttons-row">


                            <button type="button" onClick={handleRegainPassword} className="btn-forgot-pass" >
                                <RefreshCw size={14} className="inline-icon" /> Quên mật khẩu
                            </button>


                            <button type="button" onClick={handleLogout} className="btn-logout">
                                <LogOut size={14} className="inline-icon" /> Đăng xuất
                            </button>

                        </div>

                    </div>
                </main>
            </div>
        </div>

    )
}