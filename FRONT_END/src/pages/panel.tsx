import type React from "react"
import { useState } from "react";
import { logger } from "../../utils/logger";
import { useAppSelector } from "../hooks/hook";


export default function Panel () {

    const selectedCategory =  useAppSelector((state) => state.Category.selectedCategory);
    const [formData, setFormData] = useState({
        word : '',
        mean : '',
        example : ''

    });

    const handleChangeInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target ;
        setFormData(prev => ({
            ...prev,
            [name] : value
        }));
        logger.log(formData);
    }

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();
        
        
    }

    return (
        <div className="addwordpanel">
            <form className="formsubmit" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="word">Word</label>
                    <input type="text" name="word" id="word" value={formData.word} onChange={handleChangeInput} />
                </div>
                <div className="form-group">
                    <label htmlFor="meaning">Meaning</label>
                    <input type="text" name="mean" id="meaning" value={formData.mean} onChange={handleChangeInput}/>
                </div>
                <div className="form-group">
                    <label htmlFor="example">Example</label>
                    <input type="text" name="example" id="example" value={formData.example}onChange={handleChangeInput} />
                </div>
                <button type="submit" className="buttonSubmit" >Add word</button>
            </form>
        </div>
    )
}