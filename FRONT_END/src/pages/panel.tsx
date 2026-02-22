import type React from "react"
import type { Vocabulary } from "../types/vocab";
import { useState } from "react";

interface OnaddProps {
    onAdd : (data : Vocabulary) => void
}

export default function Panel ({onAdd} : OnaddProps) {
    const [word, setWord] = useState("");
    const [mean, setMeaning] = useState("");
    const [example, setExample] = useState("");

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();
        const vocabulary : Vocabulary = {
            word,
            mean,
            example
        }
        onAdd(vocabulary);
    }

    return (
        <div className="addwordpanel">
            <form className="formsubmit" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="word">Word</label>
                    <input type="text" name="" id="word" onChange={(e) => setWord(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="meaning">Meaning</label>
                    <input type="text" name="" id="meaning" onChange={(e) => setMeaning(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="example">Example</label>
                    <input type="text" name="" id="example" onChange={(e) => setExample(e.target.value)} />
                </div>
                <button type="submit" className="buttonSubmit" >Add word</button>
            </form>
        </div>
    )
}