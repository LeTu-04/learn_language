import { useEffect, useState } from "react"
import Popup from "../components/popup/popup";
import { Pencil, Trash, Home, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { editCategory, fetchCategory, softDeleteCategory } from "../services/category";
import './css/sidebar.css'
import { editCategoryLocal, removeCategoryLocal, restoreCategory, setSelectedCategory, } from "../features/Category/categorySlice.ts";
import type { getCat } from "../features/Category/category.type.ts";
import { logger } from '../../utils/logger.ts'
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import { flushPendingFavorite } from "../services/vocab_service.ts";
import { useQueryClient } from "@tanstack/react-query";

interface showAddCategoryProps {
    showAddCategory: boolean;
    toggleSidebar?: () => void;
}

export default function SideBar({ showAddCategory, toggleSidebar }: showAddCategoryProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [queryParams, setQueryParams] = useSearchParams();
    const queryClient = useQueryClient();
    const outletContext = useOutletContext<{ toggleSidebar?: () => void }>() || {};

    const handleCloseSidebar = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const closeFunc = toggleSidebar || outletContext.toggleSidebar;
        if (closeFunc) {
            closeFunc();
        }
    };

    useEffect(() => {
        const categoryIdParams = queryParams.get('category');
        console.log(categoryIdParams)
        if (categoryIdParams) {
            dispatch(setSelectedCategory(Number(categoryIdParams)));
        }
    }, [queryParams, dispatch])

    const category = useAppSelector((state) => state.Category.Category);
    const selectedCategoryId = useAppSelector((state) => state.Category.selectedCategory);

    const [popUp, setpopUp] = useState(false);
    const [inputUpdateId, setInputUpdateId] = useState<number | null>(null);


    const token = useAppSelector((state) => state.Auth.token)
    const handleClickAddCategory = () => {
        setpopUp(!popUp);

    }

    //  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)



    const handleClickEditCategory = (id: number) => {
        setInputUpdateId(id);

    }

    const handleSaveUpdateCategory = async (cat: getCat, newName: string) => {
        if (cat.name === newName) {
            setInputUpdateId(null)
            return;
        }
        const backup = { ...cat }
        dispatch(editCategoryLocal({ id: cat.id, name: newName }));
        try {
            logger.log('Đang tiến hành chỉnh sửa Category');
            await dispatch(editCategory({ id: cat.id, name: newName })).unwrap();
            setInputUpdateId(null);
            logger.log('Update Category thành công');
        } catch (error) {
            dispatch(editCategoryLocal({ id: backup.id, name: backup.name }));
            logger.error('Chỉnh sửa Category thất bại');
        }
        setInputUpdateId(null);

    }

    const handleClickRemoveCategory = async (cat: getCat, e: React.MouseEvent) => {
        e.stopPropagation();
        const backup = cat
        dispatch(removeCategoryLocal(cat.id));
        try {
            await dispatch(softDeleteCategory(cat.id)).unwrap();
            queryClient.invalidateQueries({ queryKey: ['category/removed'] });
            queryClient.invalidateQueries({ queryKey: ['quizz'] });
        } catch (error) {
            console.error("Lỗi xóa danh mục:", error);
            dispatch(restoreCategory(backup))
        }
    }

    const handleClickChooseCategory = async (cat: getCat) => {
        dispatch(setSelectedCategory(cat.id));
        logger.log(`[SelectedCatName : ${cat.name} id : ${cat.id}]`);
        await flushPendingFavorite();
        if (queryParams.get('view')) {
            setQueryParams({});
        }
        if (toggleSidebar && window.innerWidth <= 768) {
            toggleSidebar();
        }
    }

    const handleClickHome = () => {
        flushPendingFavorite()
        navigate('/home')
        if (toggleSidebar && window.innerWidth <= 768) {
            toggleSidebar();
        }
    }

    useEffect(() => {
        if (!token || category.length > 0) return
        dispatch(fetchCategory());
    }, [dispatch, token, category.length])

    useEffect(() => {
        if (category.length > 0 && selectedCategoryId === null) {
            dispatch(setSelectedCategory(category[0].id))
            logger.log(category[0].name, category[0].id);
        }
    }, [category, selectedCategoryId, dispatch])

    console.log(category);
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3 className="headtitle" style={{ margin: 0 }}>📒 My Vocabulary</h3>
                <button type="button" className="sidebar-close-mobile-btn" onClick={handleCloseSidebar} title="Đóng menu">
                    <X size={20} />
                </button>
            </div>
            {showAddCategory && <button className="buttonSidebar" onClick={handleClickAddCategory}>+ New Category</button>}
            <button className="buttonHome" onClick={handleClickHome}>
                <Home size={18} />
                <span>Trang Chủ</span>
            </button>
            {
                category.map((cat) => {
                    const currentTarget = selectedCategoryId === cat.id;
                    const categoryId = inputUpdateId === cat.id;
                    return (
                        <div key={cat.id} className={`Category ${currentTarget ? "currentCategory" : ""} `} onClick={() => handleClickChooseCategory(cat)}>
                            {categoryId ? <input type="text" className="category-edit-input"
                                defaultValue={cat.name}
                                autoFocus
                                onBlur={(e) => handleSaveUpdateCategory(cat, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSaveUpdateCategory(cat, e.currentTarget.value)
                                    } if (e.key === 'Escape') {
                                        setInputUpdateId(null);
                                    }
                                }
                                }
                            />
                                : <h3> {cat.name} </h3>}
                            <div className="action">
                                <Pencil size={18} onClick={(e) => { e.stopPropagation(); handleClickEditCategory(cat.id); }} className="pen" />
                                <Trash size={18} onClick={(e) => handleClickRemoveCategory(cat, e)} className="trash" />
                            </div>
                        </div>
                    )
                }


                )
            }
            <Popup pop={popUp} setpopUp={setpopUp} />
        </div>
    )
}