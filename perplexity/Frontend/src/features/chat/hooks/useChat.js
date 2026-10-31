import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { useDispatch, useSelector } from "react-redux";
import { setChats, setCurrentChatId, setError, setLoading } from "../chat.slice";

export const useChat = () => {

    const dispatch = useDispatch()
    const chats = useSelector((state) => state.chat.chats)

    async function handleSendMessage({ message, chatId }) {
        const trimmedMessage = message.trim()
        if (!trimmedMessage) {
            return
        }

        try {
            dispatch(setLoading(true))
            const data = await sendMessage({ message: trimmedMessage, chatId })
            const { chat, aiMessage } = data
            dispatch(setChats({
                ...chats,
                [chat._id]: {
                    ...chat,
                    messages: [
                        ...(chats[chat._id]?.messages || []),
                        { content: trimmedMessage, role: "user" },
                        aiMessage
                    ]
                }
            }))
            dispatch(setCurrentChatId(chat._id))
            return data
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Unable to send message"))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChats() {
        try {
            const data = await getChats()
            const chats = data.chats.reduce((result, chat) => ({
                ...result,
                [chat._id]: { ...chat, messages: [] }
            }), {})
            dispatch(setChats(chats))
            return chats
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Unable to load conversations"))
            throw error
        }
    }

    async function handleGetMessages(chatId) {
        try {
            const data = await getMessages(chatId)
            dispatch(setChats({
                ...chats,
                [chatId]: { ...chats[chatId], messages: data.messages }
            }))
            return data.messages
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Unable to load messages"))
            throw error
        }
    }

    async function handleDeleteChat(chatId) {
        try {
            await deleteChat(chatId)
            const nextChats = { ...chats }
            delete nextChats[chatId]
            dispatch(setChats(nextChats))
            dispatch(setCurrentChatId(null))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Unable to delete conversation"))
            throw error
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleGetMessages,
        handleDeleteChat
    }
}