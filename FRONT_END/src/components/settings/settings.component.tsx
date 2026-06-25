import { Lock, Key, RefreshCw, LogOut, User } from "lucide-react";
import React, { useState } from "react";


import TrashComponent from "../trash/trash.component";
import HistoryComponent from "../history/history.component";
import './setting.component.css'

interface SettingsComponentProps {
    typeSetting: 'settings' | 'trash' | 'history';
    onChangeName: (newName: string) => void;
    onChangePass: (oldPass: string, newPass: string) => void;
    onLogout: () => void;
    onRegainPassword: () => void;
    trashCategories: any[];
}

export default function SettingsComponent({
    typeSetting,
    onChangeName,
    onChangePass,
    onLogout,
    onRegainPassword,
    trashCategories
}: SettingsComponentProps) {
    const [name, setName] = useState<string>('');
    const [oldPass, setOldPass] = useState<string>('');
    const [newPass, setNewPass] = useState<string>('');

    const handleSubmitChangeName = () => {
        if (name.trim()) {
            onChangeName(name);
            setName("");
        }
    };

    const handleKeydownChangeName = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSubmitChangeName();
    };

    const handleChangePassword = () => {
        if (oldPass && newPass) {
            onChangePass(oldPass, newPass);
            setOldPass("");
            setNewPass("");
        }
    };

    const handleKeydownChangePassword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleChangePassword();
    };

    return (
        <main className="action-change-info">
            <div className="profile-card settings-card">
                <h3 className="setting-title">
                    {typeSetting === 'settings' && 'Cài đặt tài khoản'}
                    {typeSetting === 'trash' && 'Thùng rác danh mục'}
                    {typeSetting === 'history' && 'Nhật ký hoạt động'}
                </h3>

                <div className="settings-view-content">
                    {typeSetting === 'settings' && (
                        <div className="animate-fade-in">
                            {/* Đổi tên */}
                            <div className="setting-section">
                                <h4 className="section-label">Thông tin cá nhân</h4>
                                <div className="action-change-name">
                                    <div className="input-with-icon">
                                        <User size={18} className="input-icon" />
                                        <input
                                            type="text"
                                            placeholder="Your name..."
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onKeyDown={handleKeydownChangeName}
                                        />
                                    </div>
                                    <button type="button" onClick={handleSubmitChangeName} className="btn-save-name">
                                        Lưu
                                    </button>
                                </div>
                            </div>

                            {/* Đổi mật khẩu */}
                            <div className="setting-section">
                                <h4 className="section-label">Bảo mật</h4>
                                <div className="action-change-password">
                                    <div className="input-with-icon">
                                        <Lock size={18} className="input-icon" />
                                        <input
                                            type="password"
                                            value={oldPass}
                                            placeholder="Nhập mật khẩu cũ"
                                            onChange={(e) => setOldPass(e.target.value)}
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <div className="input-with-icon">
                                        <Key size={18} className="input-icon" />
                                        <input
                                            type="password"
                                            value={newPass}
                                            placeholder="Nhập mật khẩu mới"
                                            onChange={(e) => setNewPass(e.target.value)}
                                            onKeyDown={handleKeydownChangePassword}
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <button type="button" onClick={handleChangePassword} className="btn-change-pass">
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>

                            {/* Quên mật khẩu & Logout */}
                            <div className="setting-section action-buttons-row">
                                <button type="button" onClick={onRegainPassword} className="btn-forgot-pass">
                                    <RefreshCw size={14} className="inline-icon" /> Quên mật khẩu
                                </button>
                                <button type="button" onClick={onLogout} className="btn-logout">
                                    <LogOut size={14} className="inline-icon" /> Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}

                    {typeSetting === 'trash' && (
                        <div className="animate-fade-in">
                            <TrashComponent data={trashCategories || []} />
                        </div>
                    )}

                    {typeSetting === 'history' && (
                        <div className="animate-fade-in">
                            <HistoryComponent/>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
