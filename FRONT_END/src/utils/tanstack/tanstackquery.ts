import { useQueryClient, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { postService, type createPost } from "../../services/discuss_service";
import toast from "react-hot-toast";




export const tantackService = {
    usePosts () {
    return useInfiniteQuery({
        queryKey: ['posts'],
        // pageParam chính là biến cursor được TanStack Query truyền vào tự động
        queryFn: ({ pageParam = undefined }) => postService.getPosts(pageParam),
        staleTime : 3 * 60 * 1000,
        refetchOnWindowFocus : true,
        initialPageParam: undefined as number | undefined,
        // getNextPageParam giúp TanStack Query biết làm sao để lấy cursor cho trang tiếp theo
        getNextPageParam: (lastPage) => {
            // lastPage là dữ liệu trả về từ lần fetch gần nhất
            // Giả sử API trả về { data: { postData: [...], cursor: 15 } }
            // Nếu không còn cursor (nghĩa là đã hết bài viết), return undefined để dừng fetch
            if (!lastPage || !lastPage.nextcursor) {
                return undefined;
            }
            return lastPage.nextcursor;
        }
    });
},
    createPost () {
        const queryClient = useQueryClient(); 
        
        return useMutation ({
            mutationFn : (data : createPost) => postService.createPost(data),
            onSuccess: () => {
                toast.success('Tạo bài viết mới thành công');
                queryClient.invalidateQueries({queryKey : ['posts']})
            },
            onError : (error) => {
                toast.error('Tạo post mới thất bại')
                console.log('error : ', error)
            }
        })
    }
}