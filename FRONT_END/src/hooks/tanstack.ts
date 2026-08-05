import { useQuery } from "@tanstack/react-query"
import { getQuizzExam } from "../services/category"

export const getQuizz = (categoryId : number | null, limit? : number, view? : string) => {
    return useQuery(
        {
            queryKey : ['quizz', {categoryId, limit, view}],
            queryFn : ()=> getQuizzExam(categoryId!, limit, view),
            staleTime : Infinity,
            enabled : !!categoryId,
            refetchOnMount  : false ,
          //  refetchOnWindowFocus : false 
        }
    )
}