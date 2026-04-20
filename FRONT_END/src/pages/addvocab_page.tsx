
import { useState } from "react"

import MainContent from "./main_content_page";
import SideBar from "./sidebar";
import Panel from "./panel";
import HeaderPage from "./header_page";
import NavTabs from "../components/navigation/nav_tabs";

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
            <HeaderPage />
            <NavTabs />
            <MainContent toogleSidebar={handleToogleSideBar}></MainContent>
            <Panel />
        </div>
    )
}
