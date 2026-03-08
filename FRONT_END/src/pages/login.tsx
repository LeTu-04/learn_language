import { GoogleLogin } from "@react-oauth/google";
import { logger } from "../../utils/logger";
import { useAppDispatch } from "../hooks/hook";
import { loginGoogleWithBackend } from "../services/auth_service";
import { useNavigate } from "react-router-dom";


export default function LoginPage () {
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
    

    return (
       <div className="login_form">
        <GoogleLogin 
            onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
            loginWithBackend(credentialResponse.credential!)
        }}
            onError={
            ()=> logger.log('Không thể login với google')
            }
        />
       </div>
    )

}
