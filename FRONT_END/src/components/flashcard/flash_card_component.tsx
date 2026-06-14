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

    const getFontSize = (label : number) => {
        if(label <= 10) {
            return '2.8rem'
        }
        if(label <= 20) {
            return '2.0rem'
        }
        if(label<= 35) return '1.5rem'
        return '1.2rem'
    }

    return (
        <div className="wrapper-flashcard">
            <div className="flashcard-container" onClick={handleFlip}>
                <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
                    <div className="flashcard-front" >
                        <h2 style={ {fontSize : getFontSize(vocabulary.word.length)} } > {vocabulary.word} </h2>
                    </div>

                    <div className="flashcard-back" >
                        <h2 style={{fontSize : getFontSize(vocabulary.mean.length)}}> {vocabulary.mean} </h2>
                    </div>
                </div>
            </div>

        </div>
    )
}