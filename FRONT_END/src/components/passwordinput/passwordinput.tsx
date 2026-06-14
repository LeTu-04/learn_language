import React, { useState } from "react";
import toast from "react-hot-toast";

interface PasswordInputComponentProps {
    onSubmitNewPassword : (newPassword : string) => void;
}
interface formPassItf {
    newpass : string,
    renewpass : string
}
export default function PasswordInputComponent ({onSubmitNewPassword} : PasswordInputComponentProps) {
    const [formPass, setFormPass] = useState<formPassItf>({newpass : "", renewpass : ""});
    const handleChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormPass(
            (prev) => ({
                ...prev,
                [name] : value
            })
        )
    }
    const handleCliclSubmitNewPass = () => {
        if(formPass.newpass !== formPass.renewpass) {
            toast.error('Vui lòng xác nhận lại chính xác mật khẩu');
        }
        onSubmitNewPassword(formPass.newpass);
    }
    return (
        <div className="pass_input_container">
            <div className="type_password">
                <input type="password" placeholder="nhập mật khẩu mới" name="newpass" value={formPass.newpass} onChange={handleChangePass}/>
                <input type="password" placeholder="xác nhận lại mật khẩu" name="renewpass" value={formPass.renewpass} onChange={handleChangePass} />
            
            </div>
            <div className="pass_input_action">
                <button type="button" onClick={handleCliclSubmitNewPass}>

                </button>
            </div>
        </div>
    )
}