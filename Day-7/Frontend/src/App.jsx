import React, { useEffect, useState } from 'react'
import axios from "axios"

const App = () => {

  const [notes, setnotes] = useState([])

  function fetchNotes() {
    axios.get('http://localhost:3000/api/notes')
      .then((res) => {
        setnotes(res.data.notes)
      })
  }

  useEffect(() => {
  fetchNotes()
  }, [])

  function formSubmitHandler(e){
    e.preventDefault()

    const {title, description} = e.target.elements

    axios.post('http://localhost:3000/api/notes',{
      title: title.value,
      description: description.value
    })
    .then((res)=>{
      console.log(res.data);
      fetchNotes()
     
    })
  }

  function handleDeleteNote(noteId){
    axios.delete('http://localhost:3000/api/notes/'+ noteId)
    .then((res)=>{
      console.log(res.data)
      fetchNotes()
    })
  }

  return <>
      <form className='note-create-form'
      onSubmit={formSubmitHandler}
      >
        <input name='title' type="text" placeholder='Enter title' />
        <input name='description' type="text" placeholder='Enter description' />
        <button>Create Note</button>
      </form>
    <div className="notes">
      {
        notes.map(note => {
          return <div className="note">
            <h1>{note.title}</h1>
            <p>{note.description}</p>
            <button onClick={()=>{
              handleDeleteNote(note._id)
            }}>Delete</button>
          </div>
        })
      }
    </div>
  </>
}

export default App
