import { GoogleLogin } from "@react-oauth/google";
import { logger } from "../../utils/logger";
import { useAppDispatch } from "../hooks/hook";
import { loginGoogleWithBackend, signIn, signUp} from "../services/auth_service";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import './css/login_page.css'

export default function LoginPage () {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loginWithBackend = async(tokenId : string) => {
        try {
           await dispatch(loginGoogleWithBackend(tokenId)); 
            navigate('/home') ;  
        } catch (error) {
            logger.error('Login thất bại', error)
        }
        
    }
    
    const handleSubmit = async( e:React.FormEvent) => {
    e.preventDefault();
    try {
            const thunk = isSignUp ?   signUp : signIn ; 
            await dispatch(thunk({email, password})).unwrap(); 
            navigate('/home')
    } catch (error : any) {
        setError(error.message)
    }
    }

    return (
         <div className="login-page">
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
             {error && <p className="login-error">{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : isSignUp ? 'Đăng ký' : 'Đăng nhập'}
                    </button>
                </form>

                <p className="login-switch">
                    {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                    <span onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
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
