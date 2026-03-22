import { useState } from "react";
import './flash_card.css'

interface VocabFlashCardProps {
    vocabulary : {
        word : string,
        mean : string
    }
}

export default function FlashCard ({vocabulary} : VocabFlashCardProps) {

    const [isFlipped, setIsFlipped] = useState(false);
    const handleFlip = () => {
        setIsFlipped(!isFlipped); // Đảo ngược trạng thái
    };

    return (
        <div className="wrapper-flashcard">
            <div className="flashcard-container" onClick={handleFlip}>
                <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
                    <div className="flashcard-front">
                        <h2> {vocabulary.word} </h2>
                    </div>

                    <div className="flashcard-back" >
                        <h2> {vocabulary.mean} </h2>
                    </div>
                </div>
            </div>

        </div>
    )
}