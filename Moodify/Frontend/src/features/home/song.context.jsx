import { createContext, useState } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {

    const [song, setSong] = useState({
        "url": "https://ik.imagekit.io/vvxgcus14/moodify/songs/Ilahi_-_PagalNew__pp-oEsbPd.mp3",
        "posterUrl": "https://ik.imagekit.io/vvxgcus14/moodify/posters/Ilahi_-_PagalNew__wHeiBOOgr.jpeg",
        "title": "Ilahi - PagalNew ",
        "mood": "happy",
    })

    const [loading, setLoading] = useState(false)

    return (
        <SongContext.Provider value={{ song, setSong, loading, setLoading }}>
            {children}
        </SongContext.Provider>)
}
