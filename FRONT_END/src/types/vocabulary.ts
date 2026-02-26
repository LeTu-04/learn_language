export interface VocabularyState {
    Vocabulary : VocabularyUI[],
    loading : boolean,
    error : string | null
}


export interface VocabularyPostToSever {
    word : string, 
    mean : string,
    example? : string,
}

export interface PostVocabularyArg {
    id : number, 
    data : VocabularyPostToSever
}
export interface VocabularyResponse {
    id : number,
    word : string,
    mean : string,
    example? : string,
    categoryId : number
}

export interface VocabularyUI extends VocabularyResponse {
    requestId? : string,
    isOptimistic? : boolean
}