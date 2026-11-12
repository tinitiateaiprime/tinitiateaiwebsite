'use client'
import { useEffect, useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

function Delivery({ id }: { id: number }) {
  const [state, setState] = useState<{ deliveryStatus: string; lastError?: string; attempts?: number } | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [ack, setAck] = useState(false)
  useEffect(() => { void fetch(`/api/course-request-notifications/${id}?depth=0`, { cache: 'no-store' }).then(r => r.json()).then(setState) }, [id])
  async function retry() {
    setBusy(true); setMessage('')
    try {
      const response = await fetch(`/api/subscriptions/notifications/${id}/retry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ acknowledgePossibleDuplicate: ack }) })
      const body = await response.json()
      if (!response.ok) throw Error(body.error || 'Retry failed.')
      setState({ deliveryStatus: body.status, attempts: body.attempts, lastError: body.error })
      setMessage(body.status === 'sent' ? 'SMTP accepted the notification. Inbox delivery is not independently confirmed.' : 'The saved request is intact. Review the notification status and configuration.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Retry failed.') } finally { setBusy(false) }
  }
  return <div style={{ padding: 16, border: '1px solid var(--theme-elevation-200)', marginBottom: 20, borderRadius: 8 }}><strong>Administrator email: {state?.deliveryStatus || 'Loading…'}</strong><p>Attempts: {state?.attempts || 0}. A retry sends this notification; it never creates another course request.</p>{state?.lastError && <p role="alert">{state.lastError}</p>}<p><a href={`/admin/collections/course-request-notifications/${id}`}>View notification record</a></p>{state?.deliveryStatus !== 'sent' && <><label style={{ display: 'block', marginBottom: 12 }}><input type="checkbox" checked={ack} onChange={event => setAck(event.target.checked)} /> I checked the mail server and acknowledge a possible duplicate email if prior acceptance is uncertain.</label><button type="button" disabled={busy} onClick={retry} style={{ padding: '8px 16px' }}>{busy ? 'Retrying…' : 'Retry Administrator Email'}</button></>}{message && <p role="status">{message}</p>}</div>
}

export function AdminRequestActions() {
  const { id } = useDocumentInfo()
  const [row, setRow] = useState<{ status: string; notification?: number | { id: number } } | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { if (id) void fetch(`/api/course-subscription-requests/${id}?depth=0`, { cache: 'no-store' }).then(r => r.json()).then(setRow) }, [id])
  async function review(action: 'approve' | 'reject') {
    setBusy(true); setMessage('')
    try {
      const response = await fetch(`/api/subscriptions/${id}/review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) })
      const body = await response.json()
      if (!response.ok) throw Error(body.error || 'Review failed.')
      window.location.reload()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Review failed.'); setBusy(false) }
  }
  const notification = typeof row?.notification === 'object' ? row.notification.id : row?.notification
  return <div>{notification && <Delivery id={notification} />}{row?.status === 'pending' && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}><button type="button" disabled={busy} onClick={() => review('approve')} style={{ padding: '10px 18px' }}>Approve Course Request</button><button type="button" disabled={busy} onClick={() => review('reject')} style={{ padding: '10px 18px' }}>Reject Course Request</button></div>}<p>Approval grants this course only. Payment remains Not Collected. To send a message with your review, edit Message to student and use Status + Save.</p>{message && <p role="alert">{message}</p>}</div>
}
export function NotificationActions() { const { id } = useDocumentInfo(); return id ? <Delivery id={Number(id)} /> : null }
