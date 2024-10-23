import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
    return (
        <>
            <div>
                <Outlet />
            </div>
        </>
    )
}

function RequireAuth() {
    const { currentUser, updateUser } = useContext(AuthContext);

    return (

        !currentUser ?
            <Navigate to={'/login'} /> :
            <div>
                <Outlet />
            </div>
    )
}

export { Layout, RequireAuth };