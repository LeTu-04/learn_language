// Interface cho một vocabulary item
export interface Vocabulary {
    id: number;
    categoryId: number;
    word: string;
    mean: string;
    example: string | null;
    createdAt: string;
    deletedAt: string | null;
}

// Interface cho response khi fetch vocabularies
export interface FetchVocabularyResponse {
    message: string;
    data: {
        vocabulary: Vocabulary[];
    }[];
    STATUS_CODES: number;
}

// Interface cho response khi post vocabulary
export interface PostVocabularyResponse {
    message: string;
    data: {
        vocabulary: Vocabulary;
        countVocabulary: number;
    };
    STATUS_CODES: number;
}