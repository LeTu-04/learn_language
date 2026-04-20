import type React from "react"
import { useState } from "react";
import { logger } from "../../utils/logger";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { postVocabularyByCategory } from "../services/vocab_service";
import toast from "react-hot-toast";

import './css/panel.css'
import { useQuery } from "@tanstack/react-query";

import { apiNoAuth } from "../utils/api/api2";
import type { DictionaryEntry } from "../features/vocabulary/vocabulary.type";
import { useDebounce } from "../hooks/debound";

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



    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();

        // speak('apple')

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
            dispatch(postVocabularyByCategory({id : selectedCategory, data : vocabulary_data })).unwrap()
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


    const fetchExamplefromDictionary = async (word : string) => {
        const response = await apiNoAuth.get<DictionaryEntry[]>(`${word}`) ;
        const example = response.data[0].meanings.flatMap((meaning) => 
        meaning.definitions.filter((df) => df.example).map(
            (df) => df.example
        )) ;


        return example.length > 0? example[0] : null;

    }

    const debouncedValue = useDebounce(formData.word);

    const {data} = useQuery({
        queryKey : ['example', debouncedValue],
        queryFn : () => fetchExamplefromDictionary(debouncedValue),
        enabled : !! formData.word,
        
    }) ;



    return (
        <div className="addwordpanel">
            <form className="formsubmit" onSubmit={handleSubmit} >
                <div className="form-group">
                    <label htmlFor="word">Word</label>
                    <input type="text" name="word" id="word" value={formData.word} onChange={handleChangeInput} autoComplete="off"/>
                </div>
                <div className="form-group">
                    <label htmlFor="meaning">Meaning</label>
                    <input type="text" name="mean" id="meaning" value={formData.mean} onChange={handleChangeInput} autoComplete="off"/>
                </div>
                <div className="form-group">
                    <label htmlFor="example">Example</label>
                    <input type="text" name="example" id="example" value={formData.example}onChange={handleChangeInput} placeholder={data!} autoComplete="off"/>
                </div>
                <button type="submit"  className="buttonSubmit"  >Add word</button>
            </form>
        </div>
    )
}