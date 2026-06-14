

import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/hook";

function ProtectedRoute (){
    const accessToken = useAppSelector((state) => state.Auth.token);
    const isLoading = useAppSelector((state) => state.Auth.loading);

    if(isLoading) {
        return <div>
            <p>Loading</p>
        </div>
    }
    if(!accessToken) {
        return <Navigate to="/login" replace/>
    }

    // return <> {children}</>
    return <Outlet/>
}

export default ProtectedRoute;