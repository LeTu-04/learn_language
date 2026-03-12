import { useState } from "react";
import type { VocabularyItem } from "../../features/vocabulary/vocabulary.type";
import { Trash2 } from "lucide-react";
import {Volume2Icon} from "lucide-react"

interface vocabProps {
    vocab : VocabularyItem,
    onDelete : (id : number) => void,
    speak : (text : string) => void,
    ready : boolean
}

export default function Card ({vocab, onDelete, speak, ready} : vocabProps) {

    
    const [isExpanded, setExpanded] = useState<boolean>(false);
    const handleToogleExpande = ()=> {
        setExpanded(prev => !prev);
    }
    return (
        <div className="card">
            <div className="vocab_and_voice">
                <h3 className="word">
                    {vocab.word}
                </h3>
                <button className="buttonVoice" 
                disabled={!ready} onClick={()=> speak(vocab.word)}>
                    <Volume2Icon />
                </button>
            </div>
            <p className="meaning">
                {vocab.mean}
            </p>
            <div className="footerofcard">
                <sub className={`example ${isExpanded ? 'expanded':'' }`} 
                onClick={handleToogleExpande}>
                    " {vocab.example} "
                </sub>
                <Trash2 className="trashIconRemoveV" onClick={() => onDelete(vocab.id)}>
                </Trash2>
            </div>
        </div>
    )
}