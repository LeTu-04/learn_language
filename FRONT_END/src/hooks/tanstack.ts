import { useQuery } from "@tanstack/react-query"
import { getQuizzExam } from "../services/category"

export const getQuizz = (categoryId : number | null, limit : number, triggerRefetch?: number) => {
    return useQuery(
        {
            queryKey : ['quizz', {categoryId, triggerRefetch}],
            queryFn : ()=> getQuizzExam(categoryId!, limit),
            staleTime : Infinity,
            enabled : !!categoryId,
            refetchOnMount  : false ,
            refetchOnWindowFocus : false 
        }
    )
}