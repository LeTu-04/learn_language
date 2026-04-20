import { useNavigate } from "react-router-dom";
import './Course_box.css'
type CourseProps = {
    thumbnail : string,
    title : string,
    courseId : string
}


export default function Course_Card ({thumbnail, title, courseId} : CourseProps) {

   

    const navigate = useNavigate();
    const handleClickCourse = async() => {
        try {
            navigate(`/course/${courseId}`)
        } catch (error) {
            console.log(`Fail to load course ${error}`)
        }
    }

    return (
        <article className="course_card" role="button" tabIndex={1} onClick={handleClickCourse}>
            <img src={thumbnail} height={40} alt="image_course" />
            <p> {title}</p>
        </article>
    )
}