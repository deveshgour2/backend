import { BrowserRouter, Route, Routes } from "react-router"
import Register from "./features/auth/pages/register"
import Login from "./features/auth/pages/login"


function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Welcome to the App</h1>}/>
                <Route path="/register" element={<Register/>} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes