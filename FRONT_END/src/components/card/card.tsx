import { useState } from "react";
import type { VocabularyItem } from "../../types/vocabulary";
import { Trash2 } from "lucide-react";

interface vocabProps {
    vocab : VocabularyItem,
    onDelete : (id : number) => void
}

export default function Card ({vocab, onDelete} : vocabProps) {

    const [isExpanded, setExpanded] = useState<boolean>(false);
    const handleToogleExpande = ()=> {
        setExpanded(prev => !prev);
    }
    return (
        <div className="card">
            <h3 className="word">
                {vocab.word}
            </h3>
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