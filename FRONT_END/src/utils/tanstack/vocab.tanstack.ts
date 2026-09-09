import { useMutation } from "@tanstack/react-query"
import { importExcelFile } from "../../services/vocab_service"
import toast from "react-hot-toast";

export const VocabTanstack = {
    importExcelFile () {
        return useMutation ({
            mutationFn : ({categoryId , file} : {categoryId : string, file : File}) =>  {
                const promise = importExcelFile({categoryId, file}) ;
                return toast.promise(promise, {
                    loading : 'Đang tiến hành xử lý file Excel',
                    success : (res) => res.message || 'Xử lý thành công',
                    error : 'Upload Excel thất bại'
                });
            } ,
        })
    }
}