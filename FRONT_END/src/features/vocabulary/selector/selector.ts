import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../redux/store";



const searchKeyword = (state : RootState) => state.Vocabulary.search ;
const items = (state :RootState ) => state.Vocabulary.items ;

const selectedFilteredVocabulary = createSelector(
    [items, searchKeyword],
    (items, s) => {
        if(!s.trim()) return items ;
        return items.filter((i) => i.word.toLowerCase().includes(s.toLowerCase()));
    }
)

export default selectedFilteredVocabulary ;