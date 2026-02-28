import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hook"
import { deleteVocabularyByCategory, fetchVocabularyByCategory } from "../services/vocab_service";
import toast from "react-hot-toast";
import './main.css'
import Card from "../components/card/card";

interface MainContentProps {
    toogleSidebar : () => void
}

export default function MainContent ({toogleSidebar} : MainContentProps) {

    const dispatch = useAppDispatch();
    const Vocabulary = useAppSelector((state) => state.Vocabulary.items);
    const totalVocabulary = useAppSelector((state) => state.Vocabulary.count);
    const selectedCategory = useAppSelector((state) => state.Category.selectedCategory);
    const category = useAppSelector((state) => state.Category.Category);
    
    const getCategoryName = (categoryId : number) => {
        return category.find((c) => c.id === categoryId)?.name ;
    }
    useEffect(() => {
        if(!selectedCategory) {
            //toast.error('Chưa có category nào được chọn')
            return;
        }
        const promise = dispatch(fetchVocabularyByCategory(selectedCategory));
        return () => {
            promise.abort();
        }
    },[selectedCategory])

    const handleClickRemoveVocabulary = async(categoryId : number, vocabularyId : number) => {
        try {
            await dispatch (deleteVocabularyByCategory({categoryId, vocabularyId}))
        }catch (error) {
            toast.error('Xóa thất bại');
        }

    }

    return (
        <div className="main">
            <div className="headerofcard">
                <button className="buttonToogleSidebar" onClick={toogleSidebar}>≡</button>
                <h2 className="CategoryVocabName">Category : {getCategoryName(Vocabulary[0]?.categoryId)}</h2>
                <p>{`You have ${totalVocabulary} word 💫`}</p>
            </div>
           <div className="vocabulary-list">
                 {
                Vocabulary.map((v) => {
                    return (
                        <Card key={v.id} onDelete={() => handleClickRemoveVocabulary(v.categoryId, v.id)} vocab={v}/>
                    )
                })
            }
           </div>
        </div>
    )
}