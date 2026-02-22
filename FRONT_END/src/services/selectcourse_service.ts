import axios from 'axios'

const apiClient = axios.create({
    baseURL : 'http://localhost:3000',
    timeout : 100000,
    headers : {
        "Content-Type" : 'application/json'
    }
})
export async function fetchDataCourse (courseId : string) {
    try {
        console.log('Đang tiến hành lấy dữ liệu của khóa học...')
        const vocab = await apiClient.get(courseId);
        return vocab;
    } catch (error) {
        console.log('Có lỗi trong quá trình lấy dữ liệu dataCourse', error);
        throw error;
    }finally {
        console.log('Lấy dữ liệu của course thành công')
    }
}