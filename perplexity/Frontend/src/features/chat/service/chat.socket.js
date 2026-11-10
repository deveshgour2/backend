import { io } from "socket.io-client"

export const initializeSocketConnection = () => {

    const socket = io("https://prompto-5775.onrender.com", {
        withCredentials: true
    })

    socket.on("connect", () => {
        console.log("connected to socket.io server")
    })
}