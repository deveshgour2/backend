import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useNavigate } from 'react-router'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../../auth/hooks/useAuth'

const Icon = ({ children, className = 'h-5 w-5' }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    {children}
  </svg>
)

const Dashboard = () => {
  const { initializeSocketConnection, handleSendMessage, handleGetChats, handleGetMessages, handleDeleteChat } = useChat()
  const { handleLogout } = useAuth()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { chats = {}, currentChatId, isLoading } = useSelector((state) => state.chat)
  const [prompt, setPrompt] = useState('')
  const [activeChatId, setActiveChatId] = useState(currentChatId || null)
  const [pendingMessage, setPendingMessage] = useState(null)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState(null)

  useEffect(() => {
    initializeSocketConnection()
    handleGetChats().catch((error) => console.error(error))
  }, [])

  const activeChat = activeChatId ? chats[activeChatId] : null
  const activeChatTitle = activeChat?.title || 'Prompto'
  const messages = activeChat?.messages || []
  const displayedMessages = pendingMessage
    ? [...messages, { content: pendingMessage, role: 'user', pending: true }]
    : messages
  const recentChats = Object.values(chats)

  useEffect(() => {
    document.title = activeChatTitle
  }, [activeChatTitle])

  const selectChat = async (chatId) => {
    setActiveChatId(chatId)
    if (!chats[chatId]?.messages?.length) {
      await handleGetMessages(chatId).catch((error) => console.error(error))
    }
  }

  const sendMessage = async (event) => {
    event.preventDefault()

    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt || isLoading) return

    setPrompt('')
    setPendingMessage(trimmedPrompt)
    try {
      const { chat } = await handleSendMessage({
        message: trimmedPrompt,
        chatId: activeChatId
      })
      setActiveChatId(chat._id)
      setPendingMessage(null)
    } catch (error) {
      setPrompt(trimmedPrompt)
      setPendingMessage(null)
      console.error(error)
    }
  }

  const startNewChat = () => {
    setPrompt('')
    setActiveChatId(null)
  }

  const deleteConversation = async (chatId = activeChatId) => {
    if (!chatId) return

    try {
      await handleDeleteChat(chatId)
      if (chatId === activeChatId) {
        setActiveChatId(null)
        setPrompt('')
        setIsOptionsOpen(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const logout = async () => {
    try {
      await handleLogout()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error(error)
    }
  }

  const copyMessage = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error(error)
    }
  }

  const displayName = user?.username || user?.name || 'there'
  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#101314] text-[#d3d5da]">
      <aside className="hidden w-80 shrink-0 flex-col border-r border-white/[0.07] bg-[#171a1b] md:flex">
        <div className="flex h-19 items-center gap-3 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1d7f86] shadow-lg shadow-[#1d7f86]/20">
            <Icon className="h-5 w-5 text-[#d3d5da]">
              <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
            </Icon>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#d3d5da]">Prompto</span>
        </div>

        <div className="px-3">
          <button
            className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-base font-medium text-[#d3d5da] transition hover:border-[#1d7f86]/60 hover:bg-[#1d7f86]/10"
            onClick={startNewChat}
            type="button"
          >
            <Icon className="h-4.5 w-4.5">
              <path d="M12 5v14M5 12h14" />
            </Icon>
            New conversation
          </button>
        </div>

        <div className="scrollbar-none mt-8 flex-1 overflow-y-auto px-3">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#d3d5da]">
            Recent conversations
          </p>
          <div className="mt-3 space-y-1">
            {recentChats.length === 0 ? (
              <p className="px-3 py-3 text-sm leading-5 text-[#d3d5da]">
                Your conversations will appear here after you send a message.
              </p>
            ) : recentChats.map((chat) => (
              <div
                className={`group flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-base transition ${activeChatId === chat._id ? 'bg-[#1d7f86]/15 text-[#d3d5da]' : 'text-[#d3d5da] hover:bg-white/5 hover:text-[#d3d5da]'}`}
                key={chat._id}
              >
                <button
                  className="flex min-w-0 flex-1 items-center gap-3 py-1 text-left"
                  onClick={() => selectChat(chat._id)}
                  type="button"
                >
                  <Icon className="h-4 w-4 shrink-0">
                    <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-4-.9L4 19l1-3.5a7.2 7.2 0 0 1-1-4A7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
                  </Icon>
                  <span className="truncate">{chat.title || 'New conversation'}</span>
                </button>
                <button
                  aria-label={`Delete ${chat.title || 'conversation'}`}
                  className="shrink-0 rounded-lg p-1.5 text-[#d3d5da] opacity-0 transition hover:bg-red-500/15 hover:text-red-300 group-hover:opacity-100 focus-visible:opacity-100"
                  onClick={(event) => {
                    event.stopPropagation()
                    deleteConversation(chat._id)
                  }}
                  type="button"
                >
                  <Icon className="h-4 w-4">
                    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                  </Icon>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="relative border-t border-white/[0.07] p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1d7f86] text-sm font-bold uppercase text-[#d3d5da]">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-medium text-[#d3d5da]">{displayName}</p>
              <p className="text-sm text-[#d3d5da]">Personal workspace</p>
            </div>
          </div>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-19 items-center justify-between border-b border-white/[0.07] px-5 sm:px-8">
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d7f86]">
              <Icon className="h-4 w-4">
                <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4 18.4 5.6" />
              </Icon>
            </div>
            <span className="text-xl font-bold text-[#d3d5da]">Prompto</span>
          </div>
          <p className="hidden max-w-[60%] truncate text-base font-medium text-[#d3d5da] md:block">{activeChatTitle}</p>
          <div className="relative">
            <button aria-expanded={isOptionsOpen} aria-label="More options" className="rounded-lg p-2 text-[#d3d5da] transition hover:bg-white/6 hover:text-[#d3d5da]" onClick={() => setIsOptionsOpen((open) => !open)} type="button">
              <Icon>
                <circle cx="5" cy="12" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
              </Icon>
            </button>
            {isOptionsOpen && (
              <div className="absolute right-0 top-12 z-10 rounded-lg border border-white/10 bg-[#202526] p-1 shadow-lg">
                <button className="whitespace-nowrap rounded-md px-3 py-2 text-base text-red-300 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50" disabled={!activeChatId} onClick={deleteConversation} type="button">
                  Delete conversation
                </button>
                <button className="block w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-base text-[#d3d5da] hover:bg-white/10" onClick={logout} type="button">
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-3xl min-h-full flex-col px-5 pb-8 pt-10 sm:px-8 sm:pt-16">
            {displayedMessages.length === 0 ? (
              <div className="my-auto">
                <div className="mb-9 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1d7f86]/15 text-[#d3d5da] ring-1 ring-[#1d7f86]/25">
                    <Icon className="h-8 w-8">
                      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
                    </Icon>
                  </div>
                  <h1 className="text-6xl font-bold tracking-tight text-[#d3d5da] sm:text-5xl">How can I help you today?</h1>
                  <p className="mx-auto mt-3 max-w-lg text-lg leading-7 text-[#d3d5da]">
                    Ask anything, explore new ideas, or get help turning your thoughts into action.
                  </p>
                </div>

                <p className="text-center text-lg text-[#d3d5da]">Start a conversation using the message box below.</p>
              </div>
            ) : (
              <div className="space-y-7">
                {displayedMessages.map((message, index) => (
                  <div className={`group flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`} key={`${message.role}-${message._id || index}`}>
                    {message.role !== 'user' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1d7f86]/20 text-[#d3d5da]">
                        <Icon className="h-4 w-4">
                          <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4 18.4 5.6" />
                        </Icon>
                      </div>
                    )}
                    <div className={`max-w-[80%] text-xl leading-8 ${message.role === 'user' ? 'rounded-2xl bg-[#1d7f86] px-4 py-3 text-[#d3d5da]' : 'text-[#d3d5da]'}`}>
                      {message.role === 'user' ? (
                        message.content
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => <h1 className="mb-3 text-2xl font-semibold text-[#d3d5da]">{children}</h1>,
                            h2: ({ children }) => <h2 className="mb-3 text-xl font-semibold text-[#d3d5da]">{children}</h2>,
                            h3: ({ children }) => <h3 className="mb-2 font-semibold text-[#d3d5da]">{children}</h3>,
                            p: ({ children }) => <p className="mb-3 text-xl leading-8 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
                            a: ({ children, href }) => <a className="text-[#d3d5da] underline hover:text-[#d3d5da]" href={href} rel="noreferrer" target="_blank">{children}</a>,
                            code: ({ children, className }) => (
                              <code className={className ? 'block overflow-x-auto rounded-lg bg-black/30 p-3 text-lg text-[#d3d5da]' : 'rounded bg-black/30 px-1.5 py-0.5 text-lg text-[#d3d5da]'}>
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => <pre className="mb-3 overflow-x-auto last:mb-0">{children}</pre>
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                      {message.role !== 'user' && (
                        <button
                          aria-label={copiedMessageId === `${message.role}-${message._id || index}` ? 'Copied AI reply' : 'Copy AI reply'}
                          className="mt-2 flex items-center gap-1.5 rounded-md p-1.5 text-sm text-[#d3d5da] opacity-0 transition hover:bg-white/10 group-hover:opacity-100 focus-visible:opacity-100"
                          onClick={() => copyMessage(message.content, `${message.role}-${message._id || index}`)}
                          type="button"
                        >
                          <Icon className="h-4 w-4">
                            {copiedMessageId === `${message.role}-${message._id || index}` ? (
                              <path d="m5 12 4 4L19 6" />
                            ) : (
                              <>
                                <path d="M9 9h10v10H9z" />
                                <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                              </>
                            )}
                          </Icon>
                          {copiedMessageId === `${message.role}-${message._id || index}` ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-3 text-lg text-[#d3d5da]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1d7f86]/20 text-[#d3d5da]">
                      <Icon className="h-4 w-4">
                        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
                      </Icon>
                    </div>
                    <span className="animate-pulse">Prompto is thinking...</span>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>

          <div className="mx-auto w-full max-w-3xl shrink-0 px-5 pb-5 sm:px-8">
            <form className="rounded-2xl border border-white/12 bg-[#1a1e1f] p-2 shadow-2xl shadow-black/20" onSubmit={sendMessage}>
              <textarea
                aria-label="Message Prompto"
                className="scrollbar-none block min-h-12.5 w-full resize-none overflow-y-auto bg-transparent px-3 py-2.5 text-xl text-[#d3d5da] outline-none placeholder:text-[#d3d5da]"
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage(event)
                  }
                }}
                placeholder="Message Prompto..."
                rows="1"
                value={prompt}
              />
              <div className="flex items-center justify-between px-2 pb-1">
                <span className="text-base text-[#d3d5da]">Prompto can make mistakes. Check important info.</span>
                <button
                  aria-label="Send message"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1d7f86] text-[#d3d5da] transition hover:bg-[#2499a1] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!prompt.trim() || isLoading}
                  type="submit"
                >
                  <Icon className="h-4.5 w-4.5">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </Icon>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
