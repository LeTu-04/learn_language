import { createPortal } from "react-dom";
import "./popup.css";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, } from "..//../hooks/hook";
import { postCategory } from "../../services/category";

type popUpProps = {
    pop : boolean,
    setpopUp :  React.Dispatch<React.SetStateAction<boolean>>
}




export default function Popup ({pop, setpopUp} : popUpProps) {
    const [newcategory, setNewCategory] = useState<string>('');
    
    const inputRef = useRef<HTMLInputElement>(null);
    

    useEffect(() => {
        if(pop && inputRef.current) {
            inputRef.current.focus();
        }
    },[pop])

    const dispatch = useAppDispatch();
    const handleChangeInputCategory = (e :React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ;
        setNewCategory(value);
    }

    const handleSubmitNewCategory = async(e : React.FormEvent) => {
        e.preventDefault();
        try {
            if(newcategory.trim().length === 0){
                alert('Không được để category trống!'   )
            }else {
               
               await dispatch(postCategory({name : newcategory})).unwrap();
                setNewCategory('');
                setpopUp(false); 
            }
            
        } catch (error: any) {
            alert('Thêm category mới thất bại')
        }
    }
   
    return pop ? createPortal(
        <div className="popup-overlay" onClick={() => setpopUp(false)}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
                <h3 className="popup-title">Thêm Danh Mục Mới</h3>
                <form className="popup-form" onSubmit={handleSubmitNewCategory}>
                     <input 
                        className="popup-input"
                        placeholder="Ví dụ: Daily Life."
                        ref={inputRef} 
                        type="text"  
                        value={newcategory} 
                        onChange={handleChangeInputCategory}
                     />
                     <div className="popup-actions">
                         <button className="popup_cancel" type="button" onClick={() => setpopUp(false)}>Hủy</button>
                         <button className="popup_save_cat" type="submit">Lưu Mới</button>
                     </div>
                </form>
            </div>
        </div>,
        document.body
    ) : null
}