import { BrowserRouter, Route, Routes } from "react-router"
import Register from "./features/auth/pages/register"
import Login from "./features/auth/pages/login"
import Feed from "./features/posts/pages/Feed"
import CreatePost from "./features/posts/pages/CreatePost"


function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Feed/>}/>
                <Route path="/register" element={<Register/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/create-post" element={<CreatePost/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes