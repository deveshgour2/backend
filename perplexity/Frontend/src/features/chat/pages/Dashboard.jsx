import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hooks/useChat'

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
  const { initializeSocketConnection, handleSendMessage, handleGetChats, handleGetMessages } = useChat()
  const { user } = useSelector((state) => state.auth)
  const { chats = {}, currentChatId, isLoading } = useSelector((state) => state.chat)
  const [prompt, setPrompt] = useState('')
  const [activeChatId, setActiveChatId] = useState(currentChatId || null)
  const [pendingMessage, setPendingMessage] = useState(null)

  useEffect(() => {
    initializeSocketConnection()
    handleGetChats().catch((error) => console.error(error))
  }, [])

  const activeChat = activeChatId ? chats[activeChatId] : null
  const messages = activeChat?.messages || []
  const displayedMessages = pendingMessage
    ? [...messages, { content: pendingMessage, role: 'user', pending: true }]
    : messages
  const recentChats = Object.values(chats)

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

    // Clear the composer while the request is in flight. Restore it if the API fails.
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

  const displayName = user?.username || user?.name || 'there'

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#101314] text-slate-100">
      <aside className="hidden w-65 shrink-0 flex-col border-r border-white/[0.07] bg-[#171a1b] md:flex">
        <div className="flex h-19 items-center gap-3 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1d7f86] shadow-lg shadow-[#1d7f86]/20">
            <Icon className="h-5 w-5 text-white">
              <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
            </Icon>
          </div>
          <span className="text-lg font-semibold tracking-tight">Nexa</span>
        </div>

        <div className="px-3">
          <button
            className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-[#1d7f86]/60 hover:bg-[#1d7f86]/10"
            onClick={startNewChat}
            type="button"
          >
            <Icon className="h-4.5 w-4.5">
              <path d="M12 5v14M5 12h14" />
            </Icon>
            New conversation
          </button>
        </div>

        <div className="mt-8 flex-1 overflow-y-auto px-3">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Recent conversations
          </p>
          <div className="mt-3 space-y-1">
            {recentChats.length === 0 ? (
              <p className="px-3 py-3 text-xs leading-5 text-slate-600">
                Your conversations will appear here after you send a message.
              </p>
            ) : recentChats.map((chat) => (
              <button
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${activeChatId === chat._id ? 'bg-[#1d7f86]/15 text-[#4dc4ca]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                key={chat._id}
                onClick={() => selectChat(chat._id)}
                type="button"
              >
                <Icon className="h-4 w-4 shrink-0">
                  <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-4-.9L4 19l1-3.5a7.2 7.2 0 0 1-1-4A7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
                </Icon>
                <span className="truncate">{chat.title || 'New conversation'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.07] p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1d7f86] text-xs font-bold uppercase text-white">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-200">{displayName}</p>
              <p className="text-xs text-slate-500">Personal workspace</p>
            </div>
            <button aria-label="Account options" className="ml-auto text-slate-500 hover:text-slate-300" type="button">
              <Icon className="h-4 w-4">
                <path d="M6 9l6 6 6-6" />
              </Icon>
            </button>
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
            <span className="font-semibold">Nexa</span>
          </div>
          <p className="hidden text-sm font-medium text-slate-400 md:block">New conversation</p>
          <button aria-label="More options" className="rounded-lg p-2 text-slate-400 transition hover:bg-white/6 hover:text-white" type="button">
            <Icon>
              <circle cx="5" cy="12" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
            </Icon>
          </button>
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pb-8 pt-10 sm:px-8 sm:pt-16">
            {displayedMessages.length === 0 ? (
              <div className="my-auto">
                <div className="mb-9 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1d7f86]/15 text-[#4dc4ca] ring-1 ring-[#1d7f86]/25">
                    <Icon className="h-8 w-8">
                      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
                    </Icon>
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">How can I help you today?</h1>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
                    Ask anything, explore new ideas, or get help turning your thoughts into action.
                  </p>
                </div>

                <p className="text-center text-sm text-slate-500">Start a conversation using the message box below.</p>
              </div>
            ) : (
              <div className="space-y-7">
                {displayedMessages.map((message, index) => (
                  <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`} key={`${message.role}-${message._id || index}`}>
                    {message.role !== 'user' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1d7f86]/20 text-[#4dc4ca]">
                        <Icon className="h-4 w-4">
                          <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4 18.4 5.6" />
                        </Icon>
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-md leading-6 ${message.role === 'user' ? 'bg-[#1d7f86] text-white' : 'bg-white/6 text-slate-300'}`}>
                      {message.role === 'user' ? (
                        message.content
                      ) : (
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="mb-3 text-xl font-semibold text-white">{children}</h1>,
                            h2: ({ children }) => <h2 className="mb-3 text-lg font-semibold text-white">{children}</h2>,
                            h3: ({ children }) => <h3 className="mb-2 font-semibold text-white">{children}</h3>,
                            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
                            a: ({ children, href }) => <a className="text-[#4dc4ca] underline hover:text-white" href={href} rel="noreferrer" target="_blank">{children}</a>,
                            code: ({ children, className }) => (
                              <code className={className ? 'block overflow-x-auto rounded-lg bg-black/30 p-3 text-sm' : 'rounded bg-black/30 px-1.5 py-0.5 text-sm text-[#9de7e9]'}>
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => <pre className="mb-3 overflow-x-auto last:mb-0">{children}</pre>
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1d7f86]/20 text-[#4dc4ca]">
                      <Icon className="h-4 w-4">
                        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
                      </Icon>
                    </div>
                    <span className="animate-pulse">Nexa is thinking...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mx-auto w-full max-w-3xl px-5 pb-5 sm:px-8">
            <form className="rounded-2xl border border-white/12 bg-[#1a1e1f] p-2 shadow-2xl shadow-black/20" onSubmit={sendMessage}>
              <textarea
                aria-label="Message Nexa"
                className="block min-h-12.5 w-full resize-none bg-transparent px-3 py-2.5 text-md text-slate-100 outline-none placeholder:text-slate-500"
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage(event)
                  }
                }}
                placeholder="Message Nexa..."
                rows="1"
                value={prompt}
              />
              <div className="flex items-center justify-between px-2 pb-1">
                <span className="text-[15px] text-slate-600">Nexa can make mistakes. Check important info.</span>
                <button
                  aria-label="Send message"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1d7f86] text-white transition hover:bg-[#2499a1] disabled:cursor-not-allowed disabled:opacity-40"
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
