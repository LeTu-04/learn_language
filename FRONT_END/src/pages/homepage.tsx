
import Course_Card from "../components/box/course_box";
import "./css/homepage.css"


export default function Homepage () {
    return (
        <div className="homepage_container">
            <h1>L4LANGUAGE</h1>
            <div className="home_layout">
            <Course_Card  
                title="Thêm từ vựng" thumbnail={"/images/add.jpg"} courseId={"add_vocab"} />
            <Course_Card thumbnail={"/images/review.png"} title={"Ôn tập"} courseId={"review"} />
            <Course_Card thumbnail={"/images/discuss.png"} title={"Thảo luận"} courseId={"discuss"} />
            <Course_Card thumbnail={"/images/flashcard.jpg"} title={"Flash Card"} courseId={"flashcard"} />
        </div>
        </div>
        
    )
}