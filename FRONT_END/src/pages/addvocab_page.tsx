
import { useState } from "react"

import MainContent from "./main_content_page";
import SideBar from "./sidebar";
import Panel from "./panel";

import "./css/addvocab.css"


export default function AddVocabPage() {
    const [isSidebarOpen, setIsSideBarOpen] = useState(true);

    const handleToogleSideBar = () => {
        setIsSideBarOpen(!isSidebarOpen)
        console.log(isSidebarOpen);
    }


    return (

        <div className={`layout ${isSidebarOpen ? "sidebaropen" : "sidebarclose"}`} >

            <SideBar showAddCategory={true} />
            <MainContent toogleSidebar={handleToogleSideBar}></MainContent>
            <Panel />
        </div>
    )
}
