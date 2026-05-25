import { clientAPI } from "../utils/api/api"

interface PostData {
    id : number
    title : string
    content : string
    authorId : string,
    author : {
        id : string
        name : string | null
        email : string
        avatarUrl : string | null
    }
    createdAt : string
}

interface DiscusstDataDto {
    postData : PostData[],
    nextcursor : number | null 
}

export interface createPost  {
    title : string
    content : string
}





export const postService = {
    createPost : async (data : createPost) => {
        const response = await clientAPI.post('/discuss', data);
        return response.data ;
    },

    async getPosts (cursor? : number) {
        const response = await clientAPI.get<DiscusstDataDto>('/discuss',
            {
                params : cursor ? {cursor} : {}
            }
        );
        return response.data;
    }
}