

export interface VocabularyState {
    items : VocabularyItem[],
    count : number,
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
    categoryId : number,
    createdAt? : string ,
    deletedAt? : string | null 

}

export interface VocabularyItem extends VocabularyResponse {
    isLoading? : boolean,
    requestId? : string
}



export interface VocabularyFromServer {
    vocabulary : VocabularyResponse[]
}

export interface VocabularyFetch {
    message : string,
    data : VocabularyFromServer,
    STATUS_CODES : number
}









export interface Definition {
  definition: string;
  example?: string; 
  synonyms?: string[];
  antonyms?: string[];
}


export interface Meaning {
  partOfSpeech: string; 
  definitions: Definition[];
  synonyms?: string[];
  antonyms?: string[];
}


export interface Phonetic {
  text?: string;
  audio?: string; 
}


export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
}