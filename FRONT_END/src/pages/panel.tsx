import type React from "react"
import { useState, useRef } from "react";
import { logger } from "../../utils/logger";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { postVocabularyByCategory } from "../services/vocab_service";
import toast from "react-hot-toast";
import { Plus, X, FileSpreadsheet, Download } from "lucide-react";

import './css/panel.css'
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { apiNoAuth } from "../utils/api/api2";
import type { DictionaryEntry } from "../features/vocabulary/vocabulary.type";
import { useDebounce } from "../hooks/debound";
import { VocabTanstack } from "../utils/tanstack/vocab.tanstack";

export default function Panel() {

    const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();
    const selectedCategory = useAppSelector((state) => state.Category.selectedCategory);
    const [formData, setFormData] = useState({
        word: '',
        mean: '',
        example: ''

    });

    const { mutate: clickExcelMutate } = VocabTanstack.importExcelFile();

    const dispatch = useAppDispatch();

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && selectedCategory) {
            clickExcelMutate({
                categoryId: String(selectedCategory),
                file: file
            });
            e.target.value = '';
        }
    };

    const handleDownloadSample = () => {
        const csvContent = "\uFEFFWord,Meaning,Example\napple,quả táo,An apple a day keeps the doctor away\nbanana,quả chuối,Monkeys love bananas";
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Mau_Tu_Vung_Excel.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        logger.log(formData);
    }



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (selectedCategory === null) {
            toast.error('Không có category nào được chọn')
            return;
        }

        const vocabulary_data = {
            word: formData.word.trim(),
            mean: formData.mean.trim(),
            example: formData.example?.trim() || undefined
        }

        if (vocabulary_data.word === '' || vocabulary_data.mean === '') {
            toast.error('Không được để trống word và meaning');
            return;
        }


        try {
            await dispatch(postVocabularyByCategory({ id: selectedCategory, data: vocabulary_data })).unwrap()
            queryClient.invalidateQueries({ queryKey: ['quizz'] })
            toast.success('Thêm thành công');
            setIsMobileOpen(false);
        } catch (error) {
            toast.error("Thêm thất bại")
        }

        setFormData({
            word: '',
            mean: '',
            example: ''
        });

    }


    const fetchExamplefromDictionary = async (word: string) => {
        const cleanWord = word.trim().toLocaleLowerCase();
        if (!cleanWord || cleanWord.length < 2) return null;
        try {
            const response = await apiNoAuth.get<DictionaryEntry[]>(encodeURIComponent(cleanWord));
            const example = response.data[0].meanings.flatMap((meaning) =>
                meaning.definitions.filter((df) => df.example).map(
                    (df) => df.example
                ));


            return example.length > 0 ? example[0] : null;

        } catch (error) {
            return null;
        }


    }

    const debouncedValue = useDebounce(formData.word);

    const { data } = useQuery({
        queryKey: ['example', debouncedValue],
        queryFn: () => fetchExamplefromDictionary(debouncedValue),
        enabled: !!formData.word && debouncedValue.trim().length >= 2,
        retry: 2

    });



    return (
        <>
            <button type="button" className="mobile-add-vocab-fab" onClick={() => setIsMobileOpen(true)}>
                <Plus size={18} />
                <span>Thêm từ</span>
            </button>


            {isMobileOpen && (
                <div className="mobile-panel-backdrop" onClick={() => setIsMobileOpen(false)} />
            )}

            <div className={`addwordpanel ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="panel-mobile-header">
                    <h3>Thêm từ vựng mới</h3>
                    <button type="button" className="panel-close-btn" onClick={() => setIsMobileOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                <form className="formsubmit" onSubmit={handleSubmit} >
                    <div className="form-group">
                        <label htmlFor="word">Word</label>
                        <input type="text" name="word" id="word" value={formData.word} onChange={handleChangeInput} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="meaning">Meaning</label>
                        <input type="text" name="mean" id="meaning" value={formData.mean} onChange={handleChangeInput} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="example">Example</label>
                        <input type="text" name="example" id="example" value={formData.example} onChange={handleChangeInput} placeholder={data!}
                            onKeyDown={(e) => {
                                if ((e.key === 'Tab' || e.key === 'Enter') && !formData.example && data) {
                                    setFormData(prev => ({ ...prev, example: data }));
                                }
                            }}
                            autoComplete="off" />
                    </div>
                    <button type="submit" className="buttonSubmit" >Add word</button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx, .xls, .csv"
                        className="hidden"
                    />


                    <div className="buttonImportExcelWrapper">
                        <div className="import-excel-tooltip-container">
                            <button
                                type="button"
                                onClick={handleImportClick}
                                className="buttonImportExcel"
                            >
                                <FileSpreadsheet size={20} style={{ flexShrink: 0 }} />
                                <span>Import từ Excel</span>
                            </button>


                            <div className="excel-dropdown-popup">
                                <div className="popup-header">
                                    <FileSpreadsheet size={15} />
                                    <span>Định dạng file Excel hợp lệ</span>
                                </div>
                                <div className="popup-body">
                                    <p>• Cột A: <strong>Word</strong> </p>
                                    <p>• Cột B: <strong>Meaning</strong> </p>
                                    <p>• Cột C: <strong>Example</strong> (Không bắt buộc)</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadSample();
                                    }}
                                    className="popup-download-btn"
                                >
                                    <Download size={13} />
                                    <span>Tải file mẫu </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}