import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hook"
import { deleteVocabularyByCategory, fetchVocabularyByCategory } from "../services/vocab_service";
import toast from "react-hot-toast";
import './css/main_content.css'
import Card from "../components/card/card";
import { useSpeech } from "../components/voices/voice";
import selectedFilteredVocabulary from "../features/vocabulary/selector/selector";
import { localStorageHelper } from "../helper/localStorage_helper";
import { toogleFavorite } from "../features/vocabulary/vocabularySlice";

interface MainContentProps {
    toogleSidebar : () => void
}

export default function MainContent ({toogleSidebar} : MainContentProps) {
    const {speak, ready} =  useSpeech();

    const dispatch = useAppDispatch();
    const Vocabulary = useAppSelector(selectedFilteredVocabulary);
    const totalVocabulary = useAppSelector((state) => state.Vocabulary.count);
    const selectedCategory = useAppSelector((state) => state.Category.selectedCategory);
    const category = useAppSelector((state) => state.Category.Category);
    
    const getCategoryName = () => {
        return category.find((c) => c.id === selectedCategory)?.name;
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

    const handleChangeStatusButtonFavorite = (id : number, orginalStatus : boolean) => {
        localStorageHelper('favoritepending', (pending : Record<string, boolean>) => {
            if(pending[id] !== undefined) {
                delete pending[id];
            }else {
                pending[id] = !orginalStatus ;
            }
            return pending ;
        }
    ) ;

    dispatch(toogleFavorite(id));
    }

    return (
        <div className="main-content">
            <div className="headerofcard">
                <button className="buttonToogleSidebar" onClick={toogleSidebar}>≡</button>
                <h2 className="CategoryVocabName">Category : {getCategoryName()}</h2>
            </div>
             <p className="totalwords">{`You have ${totalVocabulary} ${totalVocabulary > 1 ? 'words' : 'word'} `}</p>
           <div className="vocabulary-list">
                 {
                Vocabulary.map((v) => {
                    return (
                        <Card key={v.id} 
                        onDelete={() => handleClickRemoveVocabulary(v.categoryId, v.id)} 
                        vocab={v}
                        speak={speak}
                        ready={ready}
                        toogleButtonFavorite={() => handleChangeStatusButtonFavorite(v.id, v.isFavorite)}
                        />
                    )
                })
            }
           </div>
        </div>
    )
}