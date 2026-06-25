import { GoogleLogin } from "@react-oauth/google";
import { logger } from "../../utils/logger";
import { useAppDispatch } from "../hooks/hook";
import { loginGoogleWithBackend, signIn, signUp } from "../services/auth_service";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import './css/login_page.css'
import OtpPopup from "../components/popup/otp_popup";
import { clientAPI } from "../utils/api/api";
import toast from "react-hot-toast";


export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
///////////////////////////////////////////////////
    const [showPopupOtp, setShowPopupOtp] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleClickTurnOffOtp = () => {
        setShowPopupOtp(false)
    }

    const getErrorMessage = (error: any, defaultMessage: string) => {
        const errorData = error?.response?.data || error;
        if (errorData && typeof errorData === 'object') {
            if (Array.isArray(errorData.message)) {
                return errorData.message.join(', ');
            }
            if (typeof errorData.message === 'string') {
                return errorData.message;
            }
        }
        return error?.message || defaultMessage;
    };

    const loginWithBackend = async (tokenId: string) => {
        try {
            await dispatch(loginGoogleWithBackend(tokenId)).unwrap();
            navigate('/home');
        } catch (error: any) {
            logger.error('Login thất bại', error)
            toast.error(getErrorMessage(error, 'Đăng nhập thất bại'))
        }

    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(isSignUp) {
           try {
            setLoading(true)
            const response = await clientAPI.post('/auth/sendotp', {email}) ;
            if(response.data.message === 'SUCCESS') {
                setShowPopupOtp(true);
            }
            setLoading(false);
            
           } catch (error: any) {
                console.log('Lỗi khi gửi OTP')
                toast.error(getErrorMessage(error, 'Lỗi khi gửi OTP'));
           }finally {
                setLoading(false)
           }
        }
        else {
            try {
            setLoading(true)
            await dispatch(signIn({ email, password })).unwrap();
            navigate('/home')
        } catch (error: any) {
            toast.error(getErrorMessage(error, 'Đăng nhập thất bại'))
        }finally {
            setLoading(false)
        }
        }
        
    }

    const checkAndSubmitValueSignUp = async(otpValue : string) => {
        try {
            setLoading(true);
            await dispatch(signUp({email, password, inputotp : otpValue})).unwrap();
            setShowPopupOtp(false);
            navigate('/home')
        } catch (error : any) {
            toast.error(getErrorMessage(error, 'Đăng ký thất bại'));
        }finally {
            setLoading(false)
           // setShowPopupOtp(false)
        }
    }

    return (
        <div className="login-page">
            {showPopupOtp && <OtpPopup type="signup" email={email} handleClickTurnOffOtp={handleClickTurnOffOtp} onSubmitOtp={(otpFromPopUp) =>checkAndSubmitValueSignUp(otpFromPopUp)} />}
            <div className="login-card">
                <h2>{isSignUp ? 'Đăng ký' : 'Đăng nhập'}</h2>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : isSignUp ? 'Đăng ký' : 'Đăng nhập'}
                    </button>
                </form>

                <p className="login-switch">
                    {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                    <span onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? ' Đăng nhập' : ' Đăng ký'}
                    </span>
                </p>

                <div className="login-divider">
                    <span>hoặc</span>
                </div>

                <div className="login-google">
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            loginWithBackend(credentialResponse.credential!);
                        }}
                        onError={() => logger.log('Không thể login với google')}
                    />
                </div>
            </div>
        </div>



    )

}
