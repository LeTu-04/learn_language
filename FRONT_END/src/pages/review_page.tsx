import NavTabs from "../components/navigation/nav_tabs";
import SideBar from "./sidebar";
import './css/review_page.css'
import ReviewComponent from "../components/review/review_component";
import { getQuizz } from "../hooks/tanstack";
import { useAppSelector } from "../hooks/hook";
import { useEffect, useState } from "react";
import { logger } from "../../utils/logger";
import  ReviewResult_Component from "../components/common/ReviewResult/Review_result";

export default function Review_Page () {
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);

    const categoryId = useAppSelector((state) => state.Category.selectedCategory);
    const {data : quiz, isLoading, isError } = getQuizz(categoryId ?? 1, 10);

    useEffect(() => {
        setIsFinished(false);
        setScore(0);
    }, [categoryId]);
    const handleFinished = (correctCount : number) => {
        setIsFinished(true);
        setScore(correctCount);
        logger.log(`Điểm[${score}]`);
        
    }
    const handleGoHome = () => {

    }
    const handleRetry = () => {

    }

    return (
       <div className="review-page-container">
        <nav>
            <NavTabs></NavTabs>
        </nav>
        <main>
            {isLoading && <p>Đang tải câu hỏi</p>}
            {isError && <p>Lỗi, không lấy được câu hỏi</p>}
             {/* key thay đổi thì react sẽ nghĩ nó bị thay đổi */}
             
            {quiz &&  isFinished ? <ReviewResult_Component correctCount={score} totalCount={quiz.length } 
            onGohome={handleGoHome} onRetry={handleRetry}/> : 
            <ReviewComponent key={categoryId} quiz={quiz} handleFinished={ handleFinished}/>}
        </main>
        <aside>
            <SideBar showAddCategory={false}></SideBar>
        </aside>
       </div>
    )
}