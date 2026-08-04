"use client"

import { useEffect, useState } from "react"
import { formatDate } from "@/lib/format"
import { deleteMessage, getAllMessages, type Message } from "@/lib/messages"

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getAllMessages()
      .then(setMessages)
      .catch(() =>
        setError("Could not load messages. Deploy the latest firestore.rules, then reload."),
      )
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(message: Message) {
    if (!confirm(`Delete the message from ${message.name}?`)) return
    try {
      await deleteMessage(message.id)
      setMessages((prev) => prev.filter((m) => m.id !== message.id))
    } catch {
      setError("Could not delete the message.")
    }
  }

  if (loading) {
    return <p className="text-[0.9375rem] text-ink-3">Loading…</p>
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.0625rem] font-semibold tracking-[-0.011em]">
          Messages ({messages.length})
        </h2>
        <p className="mt-2 max-w-[70ch] text-[0.875rem] leading-relaxed text-ink-2">
          Sent from the contact form. Senders have to be signed in and can send
          one message per day, so this list stays readable.
        </p>
      </div>

      {error && (
        <p role="alert" className="card mb-6 p-4 text-[0.875rem] text-ink-2">
          {error}
        </p>
      )}

      {messages.length === 0 ? (
        <p className="text-[0.9375rem] text-ink-3">No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li key={message.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium">{message.name}</p>
                  <p className="mt-0.5 text-[0.75rem] text-ink-3">
                    <a href={`mailto:${message.email}`} className="link-accent">
                      {message.email}
                    </a>
                    {" · "}
                    {formatDate(message.createdAt, "short")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-3">
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent("Re: your message to Shift Orbit")}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => handleDelete(message)}
                    className="text-[0.8125rem] font-medium text-ink-3 transition-colors hover:text-ink"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line text-[0.9375rem] leading-relaxed text-ink-2">
                {message.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
