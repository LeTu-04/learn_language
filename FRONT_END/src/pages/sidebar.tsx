import { useEffect, useState } from "react"
import  Popup  from "../components/popup/popup";
import { Pencil, Trash } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { editCategory, fetchCategory, softDeleteCategory } from "../services/category";
import './sidebar.css'
import { editCategoryLocal, removeCategoryLocal, restoreCategory, setSelectedCategory, } from "../components/Category/categorySlice";
import type { getCat } from "../types/category";
import {logger} from '../../utils/logger.ts'

export default function SideBar () {
    const category = useAppSelector((state) => state.Category.Category);
    const selectedCategoryId = useAppSelector((state) => state.Category.selectedCategory);

    const [popUp, setpopUp] = useState(false);
    const [inputUpdateId, setInputUpdateId] = useState<number|null>(null);

   

    const handleClickAddCategory  = () => {
        setpopUp(!popUp);
        
    }

    //  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

    const dispatch = useAppDispatch();

    const handleClickEditCategory = (id : number) => {
        setInputUpdateId(id);

    }

    const handleSaveUpdateCategory = async(cat : getCat, newName : string) => {
        if(cat.name === newName) {
            setInputUpdateId(null)
            return;
        }
        const backup = {...cat}
        dispatch(editCategoryLocal({id : cat.id, name : newName}));
        try {
            logger.log('Đang tiến hành chỉnh sửa Category');
            await dispatch(editCategory({id : cat.id, name : newName})).unwrap();
            setInputUpdateId(null);
            logger.log('Update Category thành công');
        } catch (error) {
            dispatch (editCategoryLocal({id : backup.id, name : backup.name}));
            logger.error('Chỉnh sửa Category thất bại');
        }
        setInputUpdateId(null);

    }

    const handleClickRemoveCategory = (cat : getCat) => {
        const backup  = cat
        dispatch (removeCategoryLocal(cat.id));
        try {
            dispatch(softDeleteCategory(cat.id))
        } catch (error) {
            dispatch(restoreCategory(backup))
        }
    }

    const handleClickChooseCategory = (cat : getCat) => {
        dispatch(setSelectedCategory(cat.id));
        logger.log(`[SelectedCatName : ${cat.name} id : ${cat.id}]`)   ;     
    }

    useEffect(() => {
        dispatch(fetchCategory());
    },[dispatch])

     useEffect(()=> {
        if(category.length > 0 && selectedCategoryId === null) {
            dispatch(setSelectedCategory(category[0].id))   
            logger.log(category[0].name, category[0].id);
        }
    },[category, selectedCategoryId, dispatch])
    
    console.log(category);
    return (
        <div className="sidebar">
        <h3 className="headtitle">📘 My Vocabulary</h3>
        <button className="buttonSidebar" onClick={handleClickAddCategory}>+ New Category</button>
        {
            category.map((cat) => 
            {   const currentTarget = selectedCategoryId === cat.id ;
                const categoryId = inputUpdateId === cat.id;
                return (
                    <div key={cat.id} className={`Category ${currentTarget ? "currentCategory" : ""} `} onClick={() => handleClickChooseCategory(cat)}>
                    {categoryId ? <input type="text" className="category-edit-input"
                    defaultValue={cat.name} 
                    autoFocus
                    onBlur={(e) => handleSaveUpdateCategory(cat,e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            handleSaveUpdateCategory(cat, e.currentTarget.value)
                        }if(e.key === 'Escape') {
                            setInputUpdateId(null);
                        }
                    }
                }
                    /> 
                    : <h3> {cat.name} </h3> }
                    <div className="action">
                        <Pencil size={18} onClick={()=> handleClickEditCategory(cat.id)} className="pen"/>
                        <Trash size={18} onClick={() => handleClickRemoveCategory(cat)} className="trash"/>
                    </div>
                </div>
                )
            }
                
                
            )
        }
        <Popup pop={popUp} setpopUp={setpopUp}/>
        </div>
    )
}