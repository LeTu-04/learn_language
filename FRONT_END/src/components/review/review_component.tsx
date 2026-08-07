import { useState } from "react"

import './review_component.css'
import ProgressBar from "../common/ProgressBar/progress";


interface quizProps {
    id: number,
    question: string,
    options: string[],
    correctAnswer: string
}

interface quizData {
    quiz: quizProps[];
    handleFinished: (correctCount: number) => void;
}



export default function ReviewComponent({ quiz, handleFinished }: quizData) {
    const [currentQuizzIndex, setCurrentQuizIndex] = useState(0);
    const [answer, setAnswer] = useState<Record<number, string>>({})
    // const [selectedAnswer, setSelectedAnswer] = useState<string|null >(null);
    if (!quiz || quiz.length === 0) return;
    const currentQuizz = quiz[currentQuizzIndex]

    const selectedAnswer = answer[currentQuizzIndex] ?? null;
    const handleChooseAnswer = (selected: string) => {
        if (selectedAnswer) return;
        setAnswer(prev => ({ ...prev, [currentQuizzIndex]: selected }));


    }

    const handlePrev = () => {
        if (currentQuizzIndex > 0) {
            setCurrentQuizIndex(prev => prev - 1);

        }
    }

    const handleNext = () => {
        if (currentQuizzIndex < quiz.length - 1) {
            setCurrentQuizIndex(prev => prev + 1);
        }
    }

    const handleFinishedClick = () => {
        let correctCount = 0;
        quiz.forEach((q, index) => {
            if (answer[index] === q.correctAnswer) {
                correctCount++;
            }
        });
        handleFinished(correctCount);
    }
    return (
        <div className="review_component_container">
            <div className="progressbar">
                <ProgressBar current={currentQuizzIndex + 1} total={quiz.length} label="Câu" />
            </div>


            <div className="question-set">
                <div className="question">
                    <h3> {currentQuizz.question} </h3>
                </div>
                <div className="option">
                    {currentQuizz.options.map((o) => {
                        let className = '';
                        if (selectedAnswer) {
                            if (o === selectedAnswer && selectedAnswer !== currentQuizz.correctAnswer) {
                                className = 'wrong';
                            } else if (o === currentQuizz.correctAnswer) {
                                className = 'right';
                            }
                        }
                        return (
                            <button className={className}
                                onClick={() => handleChooseAnswer(o)}>
                                {o}
                            </button>
                        )

                    })}
                </div>
            </div>
            <div className="action">
                <button onClick={handlePrev}>
                    Câu trước
                </button>
                <button onClick={currentQuizzIndex === quiz.length - 1 ? handleFinishedClick
                    : handleNext}>
                    {currentQuizzIndex === quiz.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
                </button>
            </div>
        </div>
    )
}