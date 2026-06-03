import { Backpack } from "lucide-react";
import  React, { useRef, useState } from "react"

interface propsOtpPopUp {
    handleClickSignup : (otp : string) => Promise<void>
    handleClickTurnOffOtp : ()=> void
}

export default function OtpPopup({handleClickTurnOffOtp, handleClickSignup}: propsOtpPopUp) {
    const inputRef = useRef<(HTMLInputElement | null)[]>([]);
    const [inputValue, setInputValue] = useState<string[]>(['','','','','','']);

    const handleClickRemoveInputOtp = (index : number, e : React.KeyboardEvent) => {
        if(e.key === 'Backspace' && !inputValue[index] && index > 0) {
            inputRef.current[index-1]?.focus();
        }
    }

    

    

    const handleOtpChange = (index: number, value : string)=> {
        if (value && !/^\d$/.test(value)) return;
        const otp = [...inputValue] ;
        otp[index] = value;
        setInputValue(otp);

        if(value && index < 5) {
            inputRef.current[index+1]!.focus()
        }
    }

    const handleSignUp = ()=> {
        const finalOtp = inputValue.join('');
        handleClickSignup(finalOtp);
    }

    return (
        <div className="container_mainotp_layout">
                <div className="container_input_otp">
                    {
                    inputValue.map((inp, i) => {
                    return <input 
                    className="otp_input"
                    key={i} 
                    type="text" 
                    maxLength={1} 
                    value={inp}
                    ref={(el)=> {inputRef.current[i] = el} }
                    onKeyDown={(e)=>handleClickRemoveInputOtp(i, e)}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    />
                })
                    }
                </div>
                
                <div className="container_otp_action">
                    <Backpack className="button_signup" onClick={handleClickTurnOffOtp}/>
                    <button className="button_signup" type="button" onClick={handleSignUp}>Đăng ký</button>
                </div>
            
        </div>
    )
   
}