

import { useState } from "react"
import MainContent from "./main";
import SideBar from "./sidebar";
import Panel from "./panel";
import "./addvocab.css"


export default function AddVocabPage () {
    const [isSidebarOpen, setIsSideBarOpen] = useState(true);

    const handleToogleSideBar = () => {
        setIsSideBarOpen(!isSidebarOpen)
        console.log(isSidebarOpen);
    }

  
    return (

        <div className={`layout ${isSidebarOpen ? "sidebaropen" : "sidebarclose"}`} >
            {/* {isSidebarOpen && <SideBar/>} */}
            <SideBar/>
            <MainContent toogleSidebar={handleToogleSideBar}></MainContent>
            <Panel/>
        </div>
    )
}
