// import React, { useEffect, useReducer, useState } from "react";
// import type { Action, getVocabulary, Vocabulary } from "../types/vocab";
// import { vocabService } from "../services/vocab_service";
// import "./addvocab.css"

import { useState } from "react"
import MainContent from "./main";
import SideBar from "./sidebar";
import Panel from "./panel";
import "./addvocab.css"
// export default function AddVocabPage  () {


//     function inputReducer (state : Vocabulary[], action  : Action) {
//         switch (action.type) {
//             case 'ADD_INPUT':
//                 return [
//                     ...state,
//                     {
//                         word : "",
//                         mean : ""
//                     }
//                 ];
            
//             case 'ON_CHANGE' : 
//                 const result =  state.map((item, index) => 
//                     index === action.index ? 
//                     {...item, [action.field] : action.value } : 
//                     item
//                 );
//                 console.log(result);
//                 return result;
//             case  'ON_RESET' : 
//                 return [{
//                     'word' : '',
//                     'mean' : ''
//                 }]
                
//             default:
//                 return state;
//         }
//     }

//     const [inputs, dispatch] = useReducer(inputReducer,[{
//         word : "",
//         mean : ""
//     }])

    
//     const [showList, setShowList] = useState(false);
//     const [listVocabData, setlistVocabData] = useState<getVocabulary[]>([]);
//     const [trigger, setTrigger] = useState(false);

//     useEffect(() => {
//         const fetData = async() => {
//            try {
//             const result = await vocabService.getVocab();
//             const vocabArray = result.data ;
//             if(Array.isArray(vocabArray)){
//                 setlistVocabData(vocabArray);
//                 console.log(vocabArray)
//             }else {
//                 console.error(`Dữ liệu trả về không phải là mảng ${result}`);
//                 setlistVocabData([])
//             }
//            } catch (error) {
//                 console.error('Lỗi khi lấy dữ liệu từ vựng', error)
//            }
//         }
//         fetData();
        
//     }, [trigger])
//     const handleSubmit = async(e : React.FormEvent) => {
//         e.preventDefault();
//         try {
//             const check = inputs.every((input) => {
//                 return input.mean.trim() !== '' && input.word.trim() !== ''
//             })
          
//         if(check) {
//               await vocabService.postVocab(inputs);
//             dispatch({
//                 type : 'ON_RESET'
//             });
//             setTrigger(!trigger);
//             alert('Thêm dữ liệu mới thành công ');
//         }else {
//             alert('Không được bỏ trống khi thêm dữ liệu')
//         }
        
//         } catch (error) {
//             console.log('Lỗi khi thêm từ vựng', error);
//         }
//     }

//     const handleChange = (index : number, field : keyof Vocabulary, value : string) => {
//         dispatch ({
//             type : 'ON_CHANGE',
//             index,
//             field,
//             value
//         })
//     }

//     const handleClickbuttonShow = () => {
//         setShowList(!showList)
//         console.log(showList);
//     }
//     return (
//         <div className="add_page_container">
//             <div className={`showPanner ${showList ? 'move' : ''}`}>
//                 <button className="button_show" onClick={handleClickbuttonShow}>
//                      ☰
//                 </button>
//             </div>
            
//                 <div className={`listVocab ${showList ? 'show'  :'' }` }>
//                     <h3> Danh sách từ vựng</h3>
//                     {listVocabData.map((value) => (
//                         <div className="vocabulary" key={value.id}>
//                             <p>{value.word} - {value.mean} </p>
//                         </div>
//                     ))}
//                 </div>
           
//            <div> 
//                 <form className="form_submit" onSubmit={handleSubmit}>
//                     {inputs.map((input, index) => (
//                 <div key={index}>
//                     <input type="text" name="word" placeholder="Từ vựng" 
//                     value={input.word}  onChange={(e) => handleChange(index, e.target.name as keyof Vocabulary, e.target.value)} />
//                     <input type="text" name="mean" placeholder="Nghĩa" 
//                     value={input.mean} onChange={(e) => handleChange(index, e.target.name as keyof Vocabulary, e.target.value)} />
//                 </div>
//             ))}
//             <button type="button" onClick={ () =>
//                 dispatch({
//                     type : 'ADD_INPUT'
//                 })
//             }>+</button>

//             <button type="submit">Thêm</button>
//                 </form>
//            </div>
//         </div>
//     )
// }

export default function AddVocabPage () {
    const [isSidebarOpen, setIsSideBarOpen] = useState(true);

    const handleToogleSideBar = () => {
        setIsSideBarOpen(!isSidebarOpen)
        console.log(isSidebarOpen);
    }

    const handleAdd = () => {

    }
    return (

        <div className={`layout ${isSidebarOpen ? "sidebaropen" : "sidebarclose"}`} >
            {isSidebarOpen && <SideBar/>}
            <MainContent toogleSidebar={handleToogleSideBar}></MainContent>
            <Panel onAdd={handleAdd}/>
        </div>
    )
}
