// import React, { useEffect, useState, type ChangeEvent } from "react";
// import type { Vocabulary } from "../../types/vocab";
// import "./vocab.css"
// import { vocabService } from "../../services/vocab_service";

// const defaultVobab : Vocabulary = {
//     word : "",
//     mean :"",
// }

// export default function () {
//     const [form, setForm] = useState<Vocabulary>(defaultVobab);

//     useEffect(() => {
//         console.log(form);
//     },[form])
//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement > ) => {
//         console.log(form)
//         const {name, value} = e.target ;
//         setForm((prev) => ({
//             ...prev,
//             [name] : value
//         }));
        
//     }

//     const handleSubmitVocab = async(e : React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault()
//         try {
//             console.log('Đang tiến hành gửi dữ liệu...');
//             const result = await vocabService.postVocab(form);
//             setForm(defaultVobab);
//             console.log('Lưu dữ liệu',result,' thành công!')
//         } catch (error) {
//             console.log(`Lưu dữ liệu thất bại ${error}`)
//         }
        
//     }
//     return (
//         <form className="vocab-form" onSubmit={handleSubmitVocab}>
//             <input className="field" 
//                 name="word"
//                 placeholder="từ vựng"
//                 value={form.word} 
//                 onChange={handleChange}   
//             />
//             <div className="field">
//                 <select className="field"
//                     name="wordform"
//                     //value={form.wordform}
//                     onChange={handleChange}    
//                 >   
//                     <option value="">Từ loại</option>
//                     <option value="noun">Noun</option>
//                     <option value="adj">Adj</option>
//                     <option value="adv">Adv</option>
//                     <option value="prep">Prep</option>
//                     <option value="conjunction">Liên từ</option>
//                     <option value="verb">Verb</option>
//                 </select>
//             </div>
//             <input className="field"
//                 name="mean"
//                 placeholder="nghĩa của từ"
//                 value={form.mean}
//                 onChange={handleChange}
//             />

//             <button type="submit" >
//                 Nhập
//             </button>
//         </form>
//     )
// }