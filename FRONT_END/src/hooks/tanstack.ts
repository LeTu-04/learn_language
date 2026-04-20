import { useQuery } from "@tanstack/react-query"
import { getQuizzExam } from "../services/category"

export const getQuizz = (categoryId : number, limit : number) => {
    return useQuery(
        {
            queryKey : ['quizz', {categoryId}],
            queryFn : ()=> getQuizzExam(categoryId, limit),
            staleTime : Infinity,
            refetchOnMount  : false ,
            refetchOnWindowFocus : false 
        }
    )
}