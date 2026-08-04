import { X } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import './otp_popup.css';
import { createPortal } from "react-dom";
import { clientAPI } from "../../utils/api/api";
import { UserTanstack } from "../../utils/tanstack/user.tanstack";
import toast from "react-hot-toast";

interface formPassItf {
    newpass: string,
    renewpass: string
}

type typeOtp = 'signup' | 'regain';

interface propsOtpPopUp {
    type: typeOtp;
    handleClickTurnOffOtp: () => void;
    email?: string;
    onResendOtp?: () => Promise<void> | void;
    onSubmitOtp?: (otp: string) => Promise<void> | void;
}

export default function OtpPopup({ type, handleClickTurnOffOtp, email, onResendOtp, onSubmitOtp }: propsOtpPopUp) {
    const inputRef = useRef<(HTMLInputElement | null)[]>([]);
    const [inputValue, setInputValue] = useState<string[]>(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState<number>(60);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [formPass, setFormPass] = useState<formPassItf>({ newpass: "", renewpass: "" });

    const otpIsCompleted = (inputValue.join('')).length === 6;

    const passwordIsNotSufficient = (password: string, repassword: string) => {
        if (!password || !repassword) return true;
        if (password.length < 6 || repassword.length < 6) return true;
        if (password !== repassword) return true;
        return false;
    }

    const { mutate: regainMutate } = UserTanstack.RegainPassword();

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleClickRemoveInputOtp = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !inputValue[index] && index > 0) {
            inputRef.current[index - 1]?.focus();
        }
    }

    const handleOtpChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...inputValue];
        newOtp[index] = value;
        setInputValue(newOtp);

        if (value && index < 5) {
            inputRef.current[index + 1]?.focus();
        }
    }

    const handleConfirm = () => {
        const finalOtp = inputValue.join('');
        if (type === 'signup') {
            if (onSubmitOtp) {
                onSubmitOtp(finalOtp);
            }
        } else if (type === 'regain') {
            if (!formPass.newpass || !formPass.renewpass) {
                toast.error('Vui lòng nhập đầy đủ mật khẩu mới');
                return;
            }
            if (formPass.newpass !== formPass.renewpass) {
                toast.error('Vui lòng xác nhận lại chính xác mật khẩu');
                return;
            }
            regainMutate({
                email: email!,
                otp: finalOtp,
                newPassword: formPass.newpass
            }, {
                onSuccess: () => {
                    handleClickTurnOffOtp();
                }
            });
        }
    }

    const handleResend = async () => {
        if (countdown > 0 || isSending) return;
        try {
            setIsSending(true);
            if (onResendOtp) {
                await onResendOtp();
            } else if (email) {
                await clientAPI.post('/auth/sendotp', { email });
            }
            setCountdown(60);
        } catch (error) {
            console.error("Lỗi khi gửi lại OTP:", error);
        } finally {
            setIsSending(false);
        }
    }

    const handleChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormPass(
            (prev) => ({
                ...prev,
                [name]: value
            })
        );
    }

    return (
        createPortal(
            <div className="popup_overlay">
                <div className="container_mainotp_layout">
                    <button className="button_close_otp" onClick={handleClickTurnOffOtp} aria-label="Đóng">
                        <X size={20} />
                    </button>

                    <div className="otp_header">
                        <h3 className="otp_title">Xác minh OTP</h3>
                        <p className="otp_subtitle">
                            Chúng tôi đã gửi mã xác minh gồm 6 chữ số đến email:
                            <span className="otp_email_display"> {email || "tài khoản của bạn"}</span>
                        </p>
                    </div>

                    <div className="container_input_otp">
                        {
                            inputValue.map((inp, i) => {
                                return <input
                                    className="otp_input"
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    value={inp}
                                    autoComplete="false"
                                    ref={(el) => { inputRef.current[i] = el }}
                                    onKeyDown={(e) => handleClickRemoveInputOtp(i, e)}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                />
                            })
                        }
                    </div>

                    <div className={`OTP_type-password ${(type === 'regain' && otpIsCompleted) ? 'show' : ''}`}>
                        <input type="password" placeholder="nhập mật khẩu mới" name="newpass" value={formPass.newpass} onChange={handleChangePass} />
                        <input type="password" placeholder="xác nhận lại mật khẩu" name="renewpass" value={formPass.renewpass} onChange={handleChangePass} />
                    </div>

                    <div className="otp_resend_container">
                        {countdown > 0 ? (
                            <span className="otp_countdown_text">Gửi lại mã sau <strong>{countdown}s</strong></span>
                        ) : (
                            <button
                                className="button_resend_otp"
                                onClick={handleResend}
                                disabled={isSending}
                            >
                                {isSending ? "Đang gửi..." : "Gửi lại mã"}
                            </button>
                        )}
                    </div>

                    <div className="container_otp_action">
                        <button
                            className="button_signup"
                            type="button"
                            onClick={handleConfirm}
                            disabled={
                                type === 'signup'
                                    ? !otpIsCompleted
                                    : (!otpIsCompleted || passwordIsNotSufficient(formPass.newpass, formPass.renewpass))
                            }
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}