
import { useState } from "react"

import MainContent from "./main_content_page";
import SideBar from "./sidebar";
import Panel from "./panel";

import "./css/addvocab.css"
import { useOutletContext } from "react-router-dom";


export default function AddVocabPage() {

    const { isSidebarOpen, toggleSidebar } = useOutletContext<{
        isSidebarOpen: boolean;
        toggleSidebar: () => void;
    }>();

    return (

        <div className={`layout ${isSidebarOpen ? "sidebaropen" : "sidebarclose"}`} >

            <SideBar showAddCategory={true} toggleSidebar={toggleSidebar} />
            <MainContent toogleSidebar={toggleSidebar}></MainContent>
            <Panel />
        </div>
    )
}
