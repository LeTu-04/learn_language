import React, { useState } from "react";
import type { VocabularyItem } from "../../features/vocabulary/vocabulary.type";
import { Trash2 } from "lucide-react";
import {Volume2Icon} from "lucide-react"

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


function getColor(id:number){
  const hue = (id * 137) % 360
  return `linear-gradient(
    135deg,
    hsl(${hue},70%,85%),
    hsl(${hue},70%,75%)
  )`
}
export default function Card ({vocab, onDelete, speak, ready} : vocabProps) {

    
    const [isExpanded, setExpanded] = useState<boolean>(false);
    const handleToogleExpande = ()=> {
        setExpanded(prev => !prev);
    }
    return (
        <div className="card" style={{"--accent" : getAccentColor(vocab.id) ,} as React.CSSProperties} >
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