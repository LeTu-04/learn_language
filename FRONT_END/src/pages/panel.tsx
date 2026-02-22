import type React from "react"
import type { Vocabulary } from "../types/vocab";

interface OnaddProps {
    onAdd : (data : Vocabulary) => void
}

export default function Panel ({onAdd} : OnaddProps) {

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();
        
        onAdd();
    }

    return (
        <div className="addwordpanel">
            <form className="formsubmit">
                <div className="form-group">
                    <label htmlFor="word">Word</label>
                    <input type="text" name="" id="word" />
                </div>
                <div className="form-group">
                    <label htmlFor="meaning">Meaning</label>
                    <input type="text" name="" id="meaning" />
                </div>
                <div className="form-group">
                    <label htmlFor="example">Example</label>
                    <input type="text" name="" id="example" />
                </div>
                <button type="submit" className="buttonSubmit" onClick={handleSubmit}>Add word</button>
            </form>
        </div>
    )
}