import React, { useEffect } from 'react'
import '../style/feed.scss'
import Post from '../components/Post'
import { usePost } from '../hook/usePost'
import Nav from './Nav'

const Feed = () => {

    const { feed, loading, handleGetFeed,  handleLikePost, handleUnLikePost } = usePost()

    useEffect(() => {
        handleGetFeed()
    }, [])

    if (loading || !feed) {
        return (<main><h1>Feed is loading...</h1></main>)
    }
  
    return (
        <> <Nav />
            <main className="feed-page">
                <div className="feed">
                    <div className="posts">
                        {feed.map(post => {
                            return <Post user={post.user} post={post} loading={loading} handleLikePost={handleLikePost} handleUnLikePost={handleUnLikePost} />
                        })}
                    </div>
                </div>
            </main>
        </>
    )
}

export default Feed
