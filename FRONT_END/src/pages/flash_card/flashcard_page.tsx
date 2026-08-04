import { useAppDispatch, useAppSelector } from "../../hooks/hook";


import FlashCard from "../../components/flashcard/flash_card_component";
import React, { useEffect, useState } from "react";
import { fetchCategory } from "../../services/category";
import { setSelectedCategory } from "../../features/Category/categorySlice";
import { fetchVocabularyByCategory } from "../../services/vocab_service";

import '../css/flashcard_page.css'
import SideBar from "../sidebar";
import EmptyFlashcard from "../../components/flashcard/EmptyFlashcard";
import NavTabs from "../../components/navigation/nav_tabs";
import { useOutletContext } from "react-router-dom";
import { useSpeech } from "../../components/voices/voice";

export default function FlashCard_Page() {
    const dispatch = useAppDispatch();
    const {speak, ready} = useSpeech();

    const { isSidebarOpen, toggleSidebar } = useOutletContext<{ isSidebarOpen: boolean; toggleSidebar: () => void }>();


    const categories = useAppSelector((state) => state.Category.Category);
    const selectedCategory = useAppSelector((state) => state.Category.selectedCategory);
    const vocabularies = useAppSelector((state) => state.Vocabulary.items);

    const vocabulariesLoading = useAppSelector((state) => state.Vocabulary.loading);
    const categoriesLoading = useAppSelector((state) => state.Category.loading);

    const [index, setIndex] = useState<number>(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');

    const handleClickNext = () => {
        if (index < vocabularies.length - 1) {
            setDirection('next');
            setIndex(prev => prev + 1);
        }
    }
    const handleClickPrev = () => {
        if (index > 0) {
            setDirection('prev');
            setIndex(prev => prev - 1);
        }
    }

    // const onClickSpeak = (word : string) => {
    //     speak(word);
    // }

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchCategory()).unwrap();

        }
    }, [categories.length, dispatch]);

    useEffect(() => {
        if (selectedCategory === null && categories.length > 0)
            dispatch(setSelectedCategory((categories[0].id)))
    }, [selectedCategory, categories, dispatch]);

    useEffect(() => {
        if (selectedCategory !== null) {
            setIndex(0); // Đưa index về 0 mỗi khi chuyển danh mục
            const promise = dispatch(fetchVocabularyByCategory(selectedCategory));
            return () => promise.abort();
        }
    }, [selectedCategory, dispatch]);

    if (categoriesLoading || vocabulariesLoading) {
        return (
            <div className={`container-flashcard ${isSidebarOpen ? 'sidebaropen':'sidebarclose'}`}>
                <div className="sidebar-flashcard">
                    <SideBar showAddCategory={false} />
                </div>
                <div className="container_vocab_page" style={{ justifyContent: 'flex-start', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '0 20px', gap: '15px', minHeight: '36px' }}>
                        <button className="buttonToogleSidebar" onClick={toggleSidebar}>≡</button>
                    </div>
                    <NavTabs />
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <div className="data-loading">
                            Đang tải dữ liệu...
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    if (vocabularies.length === 0 || categories.length === 0 || selectedCategory === null) {

        return (
            <div className={`container-flashcard ${isSidebarOpen ? 'sidebaropen' : 'sidebarclose'}`}>
                <div className="sidebar-flashcard">
                    <SideBar showAddCategory={false} />
                </div>
                <div className="container_vocab_page" style={{ justifyContent: 'flex-start', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '0 20px', gap: '15px', minHeight: '36px' }}>
                        <button className="buttonToogleSidebar" onClick={toggleSidebar}>≡</button>
                    </div>
                    <NavTabs />
    
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <EmptyFlashcard categoryId={selectedCategory} categoryName={categories.find(c => c.id === selectedCategory)?.name} />
                    </div>
                </div>
            </div>
        )
    }




    const currentV = vocabularies[index] || vocabularies[0];

    return (

        <div className={`container-flashcard ${isSidebarOpen ? 'sidebaropen' : 'sidebarclose'}`}>
            <div className="sidebar-flashcard">
                <SideBar showAddCategory={false} />
            </div>

            <div className="container_vocab_page" style={{ justifyContent: 'flex-start', paddingTop: '20px' }}>

                <div style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '0 20px', gap: '15px', minHeight: '36px' }}>
                    <button className="buttonToogleSidebar" onClick={toggleSidebar}>≡</button>
                </div>
                <NavTabs />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    {/* 1. Thanh tiến trình và bộ đếm (Progress Bar & Counter) */}
                    <div className="flashcard-progress-container">
                        <span className="flashcard-progress-text">
                            Thẻ {index + 1} / {vocabularies.length}
                        </span>
                        <div className="flashcard-progress-bar">
                            <div
                                className="flashcard-progress-fill"
                                style={{ width: `${((index + 1) / vocabularies.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* 2. Khu vực chứa Flashcard và Nút bấm */}
                    <div className="flashcard-interaction-row">
                        <button className="button-prev" onClick={handleClickPrev}>
                            {'<'}
                        </button>

                        <div key={index} className={`flashcard-animation-wrapper ${direction === 'next' ? 'flashcard-slide-next' : 'flashcard-slide-prev'}`}>
                            <FlashCard handleSpeak={(word) => speak(word)} vocabulary={currentV} />
                        </div>

                        <button className="button-next" onClick={handleClickNext}>
                            {'>'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
