import { useQuery } from "@tanstack/react-query"
import { getCateRemoved } from "../../services/category"

export const CateTanStack = {
    getCateDeleted(enabled : boolean) {
        return useQuery(
            {
                queryKey : ['category/removed', ],
                queryFn : () => getCateRemoved(),
                enabled : enabled
            }
        )
    },

}