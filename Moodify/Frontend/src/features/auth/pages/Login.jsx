import { Link } from "react-router"
import FormGroup from "../components/FormGroup"
import "../style/login.scss"
import { useAuth } from "../hooks/useAuth"
import { useState } from "react"
import { useNavigate } from "react-router"

const Login = () => {
    const { loading, handleLogin } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        await handleLogin({email, password})
        navigate('/')
    }

    return (
        <main className="login-page">
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <FormGroup
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email"
                        placeholder="Enter your Email" />

                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        placeholder="Enter your Password" />

                    <button className='button' type="submit">Login</button>
                </form>
                <p>Don't have an account <Link to='/register'>Register here</Link></p>
            </div>
        </main>
    )
}

export default Login
