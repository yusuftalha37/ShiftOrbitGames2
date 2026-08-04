"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { formatDate } from "@/lib/format"
import {
  getAllUsers,
  setAdmin,
  setBlocked,
  type UserRecord,
} from "@/lib/users"

export default function UsersManager() {
  const { user: current } = useAuth()
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() =>
        setError(
          "Could not load users. Deploy the latest firestore.rules, then reload.",
        ),
      )
      .finally(() => setLoading(false))
  }, [])

  function refresh() {
    return getAllUsers()
      .then(setUsers)
      .catch(() => setError("Could not reload the list."))
  }

  async function toggleAdmin(record: UserRecord) {
    if (record.uid === current?.uid) return
    if (
      record.isAdmin &&
      !confirm(`Remove admin access from ${record.email}?`)
    ) {
      return
    }
    setBusy(record.uid)
    setError("")
    try {
      await setAdmin(record.uid, !record.isAdmin)
      await refresh()
    } catch {
      setError("Could not change admin access. Check the Firestore rules.")
    } finally {
      setBusy(null)
    }
  }

  async function toggleBlocked(record: UserRecord) {
    if (record.uid === current?.uid) return
    if (!record.blocked && !confirm(`Block ${record.email}?`)) return
    setBusy(record.uid)
    setError("")
    try {
      await setBlocked(record.uid, !record.blocked)
      await refresh()
    } catch {
      setError("Could not change the block. Check the Firestore rules.")
    } finally {
      setBusy(null)
    }
  }

  if (loading) {
    return <p className="text-[0.9375rem] text-ink-3">Loading…</p>
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.0625rem] font-semibold tracking-[-0.011em]">
          Users ({users.length})
        </h2>
        <p className="mt-2 max-w-[70ch] text-[0.875rem] leading-relaxed text-ink-2">
          Everyone who has signed in. Admins can edit the site; blocked
          accounts are signed out and refused by the security rules. Accounts
          that have not signed in since this feature was added will appear the
          next time they do.
        </p>
      </div>

      {error && (
        <p role="alert" className="card mb-6 p-4 text-[0.875rem] text-ink-2">
          {error}
        </p>
      )}

      {users.length === 0 ? (
        <p className="text-[0.9375rem] text-ink-3">No users recorded yet.</p>
      ) : (
        <ul className="border-t border-line">
          {users.map((record) => {
            const isSelf = record.uid === current?.uid
            return (
              <li
                key={record.uid}
                className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-4"
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-[0.9375rem] font-medium">
                    <span className="truncate">
                      {record.displayName || record.email || record.uid}
                    </span>
                    {record.isAdmin && (
                      <span className="chip border-accent/40 text-accent">Admin</span>
                    )}
                    {record.blocked && <span className="chip">Blocked</span>}
                    {isSelf && <span className="chip">You</span>}
                  </p>
                  <p className="mt-1 text-[0.75rem] text-ink-3">
                    {record.displayName ? `${record.email} · ` : ""}
                    Last seen {formatDate(record.lastSeenAt, "short") || "—"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => toggleAdmin(record)}
                    disabled={isSelf || busy === record.uid}
                    title={isSelf ? "You cannot change your own access" : undefined}
                    className="btn btn-secondary btn-sm"
                  >
                    {record.isAdmin ? "Remove admin" : "Make admin"}
                  </button>
                  <button
                    onClick={() => toggleBlocked(record)}
                    disabled={isSelf || busy === record.uid}
                    className="text-[0.8125rem] font-medium text-ink-3 transition-colors hover:text-ink disabled:opacity-40"
                  >
                    {record.blocked ? "Unblock" : "Block"}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <p className="mt-8 text-[0.8125rem] leading-relaxed text-ink-3">
        Blocking works at the application level: the account is signed out and
        the security rules refuse it. Disabling the Firebase Auth account
        itself needs the server-side Admin SDK.
      </p>
    </div>
  )
}
