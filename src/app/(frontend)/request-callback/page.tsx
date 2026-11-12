import { Suspense } from 'react'
import RequestCallbackClient from '@/components/azure/RequestCallbackClient'
export const metadata = { title: 'Request a Callback | Tinitiate AI' }
export default function CallbackPage() { return <Suspense fallback={<p className="p-12">Loading callback form…</p>}><RequestCallbackClient /></Suspense> }
