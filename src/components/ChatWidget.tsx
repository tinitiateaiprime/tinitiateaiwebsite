'use client'

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'

type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  text: string
  sources?: string[]
}

type ChatResponse = {
  ok: boolean
  answer?: string
  error?: string
  sources?: string[]
}

const AUTO_OPEN_KEY = 'tinitiateai-chat-auto-opened'

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    text:
      'Hi! 👋 Need help choosing the right training?\n\nAsk me about courses, upcoming batches, internships, placement support, policies, or demo sessions.',
  },
]

const quickPrompts = [
  'Which course is right for me?',
  'See upcoming batches',
  'What demo slots are available?',
]

function isUserTyping() {
  const element = document.activeElement

  if (!element) return false

  const tag = element.tagName.toLowerCase()

  if (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select'
  ) {
    return true
  }

  if (
    element instanceof HTMLElement &&
    element.isContentEditable
  ) {
    return true
  }

  return false
}

function formatTime() {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

function AssistantText({
  text,
}: {
  text: string
}) {
  const lines = text.split('\n')

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmed = line.trim()

        if (!trimmed) {
          return <div key={index} className="h-1" />
        }

        const isBullet =
          trimmed.startsWith('* ') ||
          trimmed.startsWith('- ')

        const cleaned = isBullet
          ? trimmed.slice(2)
          : trimmed

        const parts = cleaned.split(/(\*\*.*?\*\*)/g)

        const content = (
          <>
            {parts.map((part, partIndex) => {
              if (
                part.startsWith('**') &&
                part.endsWith('**')
              ) {
                return (
                  <strong
                    key={partIndex}
                    className="font-semibold text-slate-900"
                  >
                    {part.slice(2, -2)}
                  </strong>
                )
              }

              return (
                <span key={partIndex}>
                  {part}
                </span>
              )
            })}
          </>
        )

        if (isBullet) {
          return (
            <div
              key={index}
              className="flex items-start gap-2"
            >
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              <span>{content}</span>
            </div>
          )
        }

        return <p key={index}>{content}</p>
      })}
    </div>
  )
}

export function ChatWidget() {
  const messageSequence = useRef(1)

  const [open, setOpen] = useState(false)
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null)

  const inputRef =
    useRef<HTMLTextAreaElement | null>(null)

  const interactedRef = useRef(false)

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      sessionStorage.getItem(AUTO_OPEN_KEY)
    ) {
      return
    }

    let timer: ReturnType<typeof setTimeout>

    const attemptAutoOpen = () => {
      if (interactedRef.current) {
        return
      }

      if (
        document.hidden ||
        isUserTyping()
      ) {
        timer = setTimeout(
          attemptAutoOpen,
          5000,
        )

        return
      }

      setOpen(true)

      sessionStorage.setItem(
        AUTO_OPEN_KEY,
        'true',
      )
    }

    timer = setTimeout(
      attemptAutoOpen,
      30000,
    )

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open) return

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, loading, open])

  useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 150)

    return () => clearTimeout(timer)
  }, [open])

  function markInteraction() {
    interactedRef.current = true

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        AUTO_OPEN_KEY,
        'true',
      )
    }
  }

  function toggleChat() {
    markInteraction()
    setOpen((current) => !current)
  }

  function closeChat() {
    markInteraction()
    setOpen(false)
  }

  async function sendMessage(
    rawMessage?: string,
  ) {
    const message = (
      rawMessage ?? input
    ).trim()

    if (!message || loading) {
      return
    }

    markInteraction()

    setInput('')

    const userMessage: ChatMessage = {
      id: ++messageSequence.current,
      role: 'user',
      text: message,
    }

    setMessages((current) => [
      ...current,
      userMessage,
    ])

    setLoading(true)

    try {
      const response = await fetch(
        '/api/chat',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            message,
          }),
        },
      )

      const data =
        (await response.json()) as ChatResponse

      if (
        !response.ok ||
        !data.ok ||
        !data.answer
      ) {
        throw new Error(
          data.error ||
            'Unable to get a response.',
        )
      }

      setMessages((current) => [
        ...current,
        {
          id: ++messageSequence.current,
          role: 'assistant',
          text: data.answer!,
          sources: data.sources,
        },
      ])
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'The assistant is temporarily unavailable.'

      setMessages((current) => [
        ...current,
        {
          id: ++messageSequence.current,
          role: 'assistant',
          text:
            message ||
            'The assistant is temporarily unavailable. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    void sendMessage()
  }

  return (
    <>
      {open && (
        <section
          aria-label="Tinitiate AI Assistant"
          className="
            fixed
            bottom-24
            right-4
            z-[90]
            flex
            h-[min(620px,calc(100dvh-120px))]
            w-[calc(100vw-32px)]
            max-w-[390px]
            flex-col
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            sm:right-6
            sm:w-[390px]
          "
        >
          <header className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <BotIcon />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    Tinitiate AI Assistant
                  </p>

                  <p className="mt-0.5 text-xs text-indigo-100">
                    Courses · Batches · Demos · Support
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeChat}
                aria-label="Close chat"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15"
              >
                <CloseIcon />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`
                      max-w-[88%]
                      rounded-2xl
                      px-4
                      py-3
                      text-sm
                      leading-6
                      ${
                        message.role ===
                        'user'
                          ? 'rounded-br-md bg-indigo-600 text-white'
                          : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm'
                      }
                    `}
                  >
                    {message.role ===
                    'assistant' ? (
                      <AssistantText
                        text={message.text}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap">
                        {message.text}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {messages.length === 1 &&
                !loading && (
                  <div className="space-y-2">
                    {quickPrompts.map(
                      (prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() =>
                            void sendMessage(
                              prompt,
                            )
                          }
                          className="block w-full rounded-xl border border-indigo-100 bg-white px-4 py-2.5 text-left text-sm font-medium text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
                        >
                          {prompt}
                        </button>
                      ),
                    )}

                    <Link
                      href="/book-a-demo"
                      onClick={markInteraction}
                      className="flex w-full items-center justify-center rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      Book a Free Demo →
                    </Link>
                  </div>
                )}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <footer className="shrink-0 border-t border-slate-200 bg-white p-3">
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => {
                  markInteraction()

                  setInput(
                    event.target.value,
                  )
                }}
                onKeyDown={(event) => {
                  if (
                    event.key ===
                      'Enter' &&
                    !event.shiftKey
                  ) {
                    event.preventDefault()

                    if (
                      input.trim() &&
                      !loading
                    ) {
                      void sendMessage()
                    }
                  }
                }}
                rows={1}
                maxLength={1500}
                placeholder="Ask about courses, batches, demos..."
                className="
                  max-h-28
                  min-h-[44px]
                  flex-1
                  resize-none
                  rounded-2xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-indigo-400
                  focus:ring-2
                  focus:ring-indigo-100
                "
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  !input.trim()
                }
                aria-label="Send message"
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-indigo-600
                  text-white
                  shadow-sm
                  transition
                  hover:bg-indigo-700
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <SendIcon />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between px-1">
              <span className="text-[10px] text-slate-400">
                AI answers may take a few seconds.
              </span>

              <span className="text-[10px] text-slate-400">
                {formatTime()}
              </span>
            </div>
          </footer>
        </section>
      )}

      <button
        type="button"
        onClick={toggleChat}
        aria-label={
          open
            ? 'Close Tinitiate AI Assistant'
            : 'Open Tinitiate AI Assistant'
        }
        className="
          fixed
          bottom-5
          right-4
          z-[91]
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-gradient-to-br
          from-indigo-600
          to-violet-600
          text-white
          shadow-xl
          transition
          hover:-translate-y-0.5
          hover:shadow-2xl
          sm:right-6
        "
      >
        {open ? (
          <CloseIcon />
        ) : (
          <ChatIcon />
        )}
      </button>
    </>
  )
}

function ChatIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  )
}

function BotIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="7"
        width="16"
        height="12"
        rx="3"
      />
      <path d="M9 11h.01M15 11h.01M8 15h8M12 7V3M9 3h6" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}