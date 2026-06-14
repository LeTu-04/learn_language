export interface User {
    id : string
    email? : string,
    name : string,
    avatarUrl? : string,

}

export interface AuthState {
    user : User | null
    token : string | null
    loading : boolean
    error? : string | null
}

