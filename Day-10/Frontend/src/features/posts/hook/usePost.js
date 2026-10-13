import { PostContext } from "../post.context";
import { useContext, useEffect } from "react";
import { createPost, getFeed, likedPost, unLikedPost } from "../services/post.api";

export const usePost = () => {
    const context = useContext(PostContext)

    const { loading, setLoading, post, setPost, feed, setFeed } = context

    const handleGetFeed = async () => {
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts)
        setLoading(false)
    }

    const handleCreatePost = async (imageFile, caption) => {
        setLoading(true)
        const data = await createPost(imageFile, caption)
        setFeed([data.post, ...feed])
        setLoading(false)
    }

    const handleLikePost = async (post) => {
        const data = await likedPost(post)
        await handleGetFeed()
    }

    const handleUnLikePost = async (post) => {
        const data = await unLikedPost(post)
        await handleGetFeed()
    }

    useEffect(() => {
        handleGetFeed()
    }, [])

    return { loading, feed, post, handleGetFeed, handleCreatePost, handleLikePost, handleUnLikePost }
}