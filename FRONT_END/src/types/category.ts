export interface getCat {
    id : number,
    name : string
}

export interface postCat {
    name : string
}

export interface CategoryState { 
    Category : getCat[],
    loading : boolean,
    error : string | undefined
}