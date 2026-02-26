export interface VocabularyState {
    Vocabulary : VocabularyResponse[],
    loading : boolean,
    error : string | null
}


export interface VocabularyResponseFromAPI {
    
}
export interface VocabularyResponse {
    word : string,
    mean : string,
    example : string
}