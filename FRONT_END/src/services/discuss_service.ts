import { clientAPI } from "../utils/api/api"

interface PostData {
    id: number
    title: string
    content: string
    authorId: string,
    author: {
        id: string
        name: string | null
        email: string
        avatarUrl: string | null
    }

    image_url: string
    createdAt: string
    likecount: {
        heartCount : number,
        commentCount : number
    }
    isLiked: boolean
}

interface DiscusstDataDto {
    postData: PostData[],
    nextcursor: number | null
}

export type createPost = FormData;





export const postService = {
    createPost: async (data: createPost) => {
        const response = await clientAPI.post('/discuss', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    async getPosts(cursor?: number) {
        const response = await clientAPI.get<DiscusstDataDto>('/discuss',
            {
                params: cursor ? { cursor } : {}
            }
        );
        return response.data;
    },

}