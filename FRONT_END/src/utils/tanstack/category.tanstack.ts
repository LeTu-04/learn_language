import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteForeverCategory, getCateRemoved, restoreCategory, fetchCategory } from "../../services/category"
import toast from "react-hot-toast"
import { useAppDispatch } from "../../hooks/hook"

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

    deletePermCate() {
        const queryClient = useQueryClient();
        return useMutation ({
            mutationFn : (categoryId: number) => {
                const promise = deleteForeverCategory(categoryId);
                toast.promise(promise, {
                    loading: 'Đang tiến hành xóa vĩnh viễn...',
                    success: 'Xóa thành công',
                    error: 'Xóa thất bại'
                });
                return promise;
            },
            onSuccess : () => {
                queryClient.invalidateQueries({ queryKey: ['category/removed'] });
            },
            onError : (error) => {
                console.log(error)
            }
        })
    },
    restoreCate () {
        const queryClient = useQueryClient();
        const dispatch = useAppDispatch();
        return useMutation ({
            mutationFn : (categoryId: number) => {
                const promise = restoreCategory(categoryId);
                toast.promise(promise, {
                    loading: 'Đang tiến hành khôi phục...',
                    success: 'Khôi phục thành công',
                    error: 'Khôi phục thất bại'
                });
                return promise;
            },
            onSuccess : () => {
                queryClient.invalidateQueries({ queryKey: ['category/removed'] });
                dispatch(fetchCategory());
            },
            onError : (error) => {
                console.log(error)
            }
        })
    }

}