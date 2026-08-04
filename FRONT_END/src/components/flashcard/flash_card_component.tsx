import React, { useState } from "react";
import './flash_card.css'
import { Volume2Icon } from "lucide-react";

interface VocabFlashCardProps {
    vocabulary: {
        word: string,
        mean: string
    },
    handleSpeak: (word: string) => void;
}

export default function FlashCard({ vocabulary, handleSpeak }: VocabFlashCardProps) {

    const [isFlipped, setIsFlipped] = useState(false);
    const handleFlip = () => {
        setIsFlipped(!isFlipped); // Đảo ngược trạng thái
    };

    const handleWordVoiceClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleSpeak(vocabulary.word);
    };

    const handleMeanVoiceClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleSpeak(vocabulary.mean);
    }
    const getFontSize = (label: number) => {
        if (label <= 10) {
            return '2.8rem'
        }
        if (label <= 20) {
            return '2.0rem'
        }
        if (label <= 35) return '1.5rem'
        return '1.2rem'
    }

    return (
        <div className="wrapper-flashcard">

            <div className="flashcard-container" onClick={handleFlip}>
                <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
                    <div className="flashcard-front" >
                        <button onClick={handleWordVoiceClick} className="button_voice">
                            <Volume2Icon size={22} />
                        </button>
                        <h2 style={{ fontSize: getFontSize(vocabulary.word.length) }} > {vocabulary.word} </h2>
                    </div>

                    <div className="flashcard-back" >
                        <button onClick={handleMeanVoiceClick} className="button_voice">
                            <Volume2Icon size={22} />
                        </button>
                        <h2 style={{ fontSize: getFontSize(vocabulary.mean.length) }}> {vocabulary.mean} </h2>
                    </div>
                </div>
            </div>

        </div>
    )
}