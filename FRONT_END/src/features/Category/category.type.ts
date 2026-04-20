
export interface getCat {
    id : number,
    name : string
}

export interface postCat {
    name : string, 

}


export interface CategoryPostResponse {
    message : string,
    data : getCat,
    STATUS_CODES : number
}

export interface CategoryResponse {
    message: string
    data: getCat[]
    STATUS_CODES: number
}


export interface CategoryState { 
    Category : getCat[],
    loading : boolean,
    selectedCategory : number | null,
    error : string | undefined
}