import { Outlet, useLocation } from "react-router-dom";
import NavTabs from "../components/navigation/nav_tabs";
import HeaderPage from "../pages/header_page";

import './mainlayout.css'

export default function MainLayout() {
    const location = useLocation();

    const isShowSearch = location.pathname === '/course/add_vocab' || location.pathname === '/course/discuss';
     const hasSidebar = location.pathname === '/course/add_vocab' || location.pathname === '/course/review';

    return (
        <div className="main-layout-containerr">

            <NavTabs />
            <div className="content-area">
                <HeaderPage showSearch={isShowSearch} />
                <main style={{ padding: hasSidebar ? "0px": "20px" , flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}