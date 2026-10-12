import React from 'react'
import "../style/createPost.scss"
import { useState, useRef } from 'react'
import {useNavigate} from "react-router"
import { usePost } from '../hook/usePost'

const CreatePost = () => {

  const [caption, setCaption] = useState("")

  const postImageInputFielRef = useRef(null)

  const navigate = useNavigate()

  const {loading, handleCreatePost} = usePost()

  async function handleSubmit(e) {
    e.preventDefault()
    const file = postImageInputFielRef.current.files[0]

    await handleCreatePost(file, caption)
    navigate('/')
  }

  if(loading){
    return <main><h1>Creating Post</h1></main>
  }

  return (
    <main className="create-post">
      <div className="form-container">
        <h1>Create Post</h1>
        <form
          onSubmit={handleSubmit}
        >
          <label htmlFor="postImage"> Select Image</label>
          <input type="file" ref={postImageInputFielRef} hidden name='postImage' id='postImage' />
          <input
            value={caption}
            onChange={(e) => { setCaption(e.target.value) }}
            type="text" name='caption' id='caption' placeholder='Enter caption' />
          <button className='post-button'>create post</button>
        </form>
      </div>
    </main>
  )
}

export default CreatePost