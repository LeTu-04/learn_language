import { createPortal } from "react-dom";
import "./popup.css";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "..//../hooks/hook";
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
        console.log(value);
    }

    const handleSubmitNewCategory = async(e : React.FormEvent) => {
        e.preventDefault();
        try {
            if(newcategory.trim().length === 0){
                alert('Không được để category trống!'   )
            }else {
               
               await dispatch(postCategory({name : newcategory})).unwrap();
                console.log('Success upload new Category');
                setNewCategory('');
                setpopUp(false); 
            }
            
        } catch (error) {
            console.log('Fail in upload new Category ');
            alert('Thêm category mới thất bại')
        }
    }
   
    return pop ? createPortal(
        <div className="popup">
           <form onSubmit={handleSubmitNewCategory}>
                <input ref={inputRef} type="text"  value={newcategory} onChange={handleChangeInputCategory}/>
                <button className="popup_cancel" type="button" onClick={() => setpopUp(!pop)}>Hủy</button>
                <button className="popup_save_cat" type="submit">Lưu</button>
           </form>
        </div>,
        document.body
    ) : null
}