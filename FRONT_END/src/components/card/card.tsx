import React, { useState } from "react";
import type { VocabularyItem } from "../../features/vocabulary/vocabulary.type";
import { Trash2, Volume2Icon, Star } from "lucide-react"; // Đã import thêm Star

interface vocabProps {
    vocab : VocabularyItem,
    onDelete : (id : number) => void,
    speak : (text : string) => void,
    ready : boolean
}

function getAccentColor(id:number){
  const hue = (id * 137) % 360
  return `hsl(${hue},70%,55%)`
}

export default function Card ({vocab, onDelete, speak, ready} : vocabProps) {
    const [isExpanded, setExpanded] = useState<boolean>(false);
    
 
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    const handleToogleExpande = ()=> {
        setExpanded(prev => !prev);
    }
    
    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
    }

    return (
        <div className="card" style={{"--accent" : getAccentColor(vocab.id) ,} as React.CSSProperties} >
            <div className="vocab_and_voice">
                <h3 className="word">
                    {vocab.word}
                </h3>
                
                {/* Khu vực chứa các nút icon bên góc phải */}
                <div className="action-icons">
                    <button className="buttonStar" onClick={handleToggleFavorite} title="Thêm vào yêu thích">
                        <Star fill={isFavorite ? "#fbbf24" : "transparent"} color={isFavorite ? "#fbbf24" : "#9ca3af"} size={22} className="starIcon"/>
                    </button>

                    <button className="buttonVoice" 
                    disabled={!ready} onClick={()=> speak(vocab.word)} title="Phát âm thanh">
                        <Volume2Icon size={22} />
                    </button>
                </div>
            </div>
            <p className="meaning">
                {vocab.mean}
            </p>
            <div className="footerofcard">
                <div className="wrap-example" style={{ "--wrap-accent" :  getAccentColor(vocab.id)} as React.CSSProperties}>
                    <p className={`example ${isExpanded ? 'expanded':'' }`} 
                onClick={handleToogleExpande}>
                    {vocab.example} "
                </p>
                </div>
                <Trash2 className="trashIconRemoveV" onClick={() => onDelete(vocab.id)}>
                </Trash2>
            </div>
        </div>
    )
}