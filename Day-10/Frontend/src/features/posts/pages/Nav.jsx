import React from 'react'
import "../style/nav.scss"
import { useNavigate } from 'react-router'

const Nav = () => {

    const navigate = useNavigate()

  return (
    <div className="navbar">
        <h1>Pixora</h1>
        <button
        onClick={()=>{navigate('/create-post')}}
        >Create Post</button>
    </div>
  )
}

export default Nav
