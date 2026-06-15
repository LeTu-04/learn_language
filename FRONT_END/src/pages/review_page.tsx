
import SideBar from "./sidebar";
import './css/review_page.css'
import ReviewComponent from "../components/review/review_component";
import { getQuizz } from "../hooks/tanstack";
import { useAppSelector } from "../hooks/hook";
import { useEffect, useState } from "react";
import { logger } from "../../utils/logger";
import ReviewResult_Component from "../components/common/ReviewResult/Review_result";
import { useNavigate, useOutletContext } from "react-router-dom";
import EmptyFlashcard from "../components/flashcard/EmptyFlashcard";

export default function Review_Page() {
    const navigate = useNavigate();
    const { isSidebarOpen, toggleSidebar } = useOutletContext<{ isSidebarOpen: boolean; toggleSidebar: () => void }>();
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);

    const [retry, setCountRetry] = useState<number>(0);

    const categoryId = useAppSelector((state) => state.Category.selectedCategory);
    const vocabulariesLength = useAppSelector((state) => state.Vocabulary.count);
    const { data: quiz, isLoading, isError } = getQuizz(categoryId, 10, vocabulariesLength);

    useEffect(() => {
        setIsFinished(false);
        setScore(0);
    }, [categoryId]);
    const handleFinished = (correctCount: number) => {
        setIsFinished(true);
        setScore(correctCount);
        logger.log(`Điểm[${score}]`);

    }
    const handleGoHome = () => {
        navigate('/home')
    }
    const handleRetry = () => {
        setCountRetry((prev) => prev + 1);
        setIsFinished(false);
    }

    if (!categoryId) {
        return (
            <div className={`review-page-container ${isSidebarOpen ? "sidebaropen":"sidebarclose"}`}>
                {/* <nav><NavTabs /></nav> */}
                <main>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', gap: '15px' }}>
                        <button className="buttonToogleSidebar" onClick={toggleSidebar}>≡</button>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <p style={{ textAlign: 'center' }}>Bạn chưa có danh mục nào để ôn tập!</p>
                    </div>
                </main>
                <aside><SideBar showAddCategory={false} /></aside>
            </div>
        )
    }

    if (quiz && quiz.length === 0) {
        return <div className={`review-page-container ${isSidebarOpen ? "sidebaropen" : "sidebarclose"}`}>

            <main>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', gap: '15px' }}>
                    <button className="buttonToogleSidebar" onClick={toggleSidebar}>≡</button>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <EmptyFlashcard categoryId={categoryId!} />
                </div>
            </main>
            <aside>
                <SideBar showAddCategory={false} />
            </aside>
        </div>
    }
    return (
        <div className={`review-page-container ${isSidebarOpen ? "sidebaropen" : "sidebarclose"}`}>
            {/* <nav>
                <NavTabs></NavTabs>
            </nav> */}
            <main>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', gap: '15px' }}>
                    <button className="buttonToogleSidebar" onClick={toggleSidebar}>≡</button>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    {isLoading && <p>Đang tải câu hỏi</p>}
                    {isError && <p>Lỗi, không lấy được câu hỏi</p>}
                    {/* key thay đổi thì react sẽ nghĩ nó bị thay đổi */}
                    {quiz && isFinished ? <ReviewResult_Component correctCount={score} totalCount={quiz.length}
                        onGohome={handleGoHome} onRetry={handleRetry} /> :
                        <ReviewComponent key={`${categoryId}-${retry}`} quiz={quiz} handleFinished={handleFinished} />}
                </div>
            </main>
            <aside>
                <SideBar showAddCategory={false}></SideBar>
            </aside>
        </div>
    )
}