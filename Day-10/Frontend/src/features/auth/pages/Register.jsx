import { useState } from 'react'
import '../style/form.scss'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'


const Register = () => {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { loading, handleRegister } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <h1>Loading...</h1>
    )
  }

  async function submitHandler(e) {
    e.preventDefault()

    handleRegister(username, email, password)
      .then(res => {
        console.log(res)
        navigate('/')
      })
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form
          onSubmit={submitHandler}
        >
          <input
            onInput={(e) => { setUsername(e.target.value) }}
            type="text"
            name='username'
            placeholder='Enter username' />

          <input
            onInput={(e) => { setEmail(e.target.value) }}
            type="text"
            name='email'
            placeholder='Enter email' />

          <input
            onInput={(e) => { setPassword(e.target.value) }}
            type="password"
            name='password'
            placeholder='Enter password' />

          <button>Submit</button>
        </form>

        <p>Already have an account? <Link className='toggleAuthForm' to='/login'>Login</Link></p>
      </div>
    </main>
  )
}

export default Register
