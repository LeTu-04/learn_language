export interface User {
    id : string
    email? : string,
    name : string,
    avatarUlr? : string,

}

export interface AuthState {
    user : User | null
    token : string | null
    loading : boolean
    error? : string | null
}