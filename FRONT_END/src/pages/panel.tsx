import type React from "react"
import { useState } from "react";
import { logger } from "../../utils/logger";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { postVocabularyByCategory } from "../services/vocab_service";
import toast from "react-hot-toast";



export default function Panel () {

    const selectedCategory =  useAppSelector((state) => state.Category.selectedCategory);
    const [formData, setFormData] = useState({
        word : '',
        mean : '',
        example : ''

    });

    const dispatch = useAppDispatch();

    const handleChangeInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target ;
        setFormData(prev => ({
            ...prev,
            [name] : value
        }));
        logger.log(formData);
    }


    // chỗ này để test api giọng đọc
    const speak = (text : string) => {
        const utterance = new SpeechSynthesisUtterance(text);

        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find(v =>
            v.lang === "en-US" && v.name.includes("Google")
        );

        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        utterance.rate = 0.9;
        utterance.pitch = 1;

        speechSynthesis.speak(utterance);
};




    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();

        speak('dispose of')

        if(selectedCategory === null) {
            toast.error('Không có category nào được chọn')
            return;
        }
        
        const vocabulary_data = {
            word : formData.word.trim(),
            mean : formData.mean.trim(),
            example : formData.example?.trim() || undefined
        }
        
        if(vocabulary_data.word === '' || vocabulary_data.mean === '') {
            toast.error('Không được để trống word và meaning');
            return ;
        }

       
        try {
            dispatch(postVocabularyByCategory({id : selectedCategory, data : vocabulary_data }))
            toast.success('Thêm thành công');
        } catch (error) {
            toast.error("Thêm thất bại")
        }

        setFormData({
            word : '',
            mean : '',
            example : ''
        });
        
    }

    return (
        <div className="addwordpanel">
            <form className="formsubmit" onSubmit={handleSubmit} >
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
                <button type="submit"  className="buttonSubmit"  >Add word</button>
            </form>
        </div>
    )
}