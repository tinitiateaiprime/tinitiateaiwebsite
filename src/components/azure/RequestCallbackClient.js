"use client";

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { User, Mail, Phone, Clock, MessageSquare,Book } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RequestCallbackPage() {
  const searchParams = useSearchParams()
  const courseFromQuery =
    searchParams.get('course') || searchParams.get('service') ||
    ''
  const [form, setForm] = useState({ name: '', email: '', phone: '',course:courseFromQuery, preferredTime: '', message: courseFromQuery ? `I am interested in ${courseFromQuery}.` : '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/request-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      setForm({ name: '', email: '', phone: '',course:'', preferredTime: '', message: '' })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-50 to-white p-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h2>
          <p className="text-gray-700 mb-6">We&apos;ve received your request and will call you shortly.</p>
          <motion.button onClick={() => setStatus('idle')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
            Submit Another
          </motion.button>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 px-6">
      <div className="relative max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Request a <span className="text-blue-600">Callback</span></h1>
          <p className="text-gray-600 mb-6">Fill in your details and our expert consultant will reach out to you.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="bg-white shadow-xl rounded-2xl p-8">
          <form name="request-callback" method="POST" onSubmit={handleSubmit} className="space-y-4">
            

            <div className="flex items-center border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 border">
              <User className="text-gray-400 m-3" />
              <input aria-label="name" name="name" type="text" placeholder="Your Name" required value={form.name} onChange={handleChange} className="min-w-0 flex-1 p-3 placeholder-gray-500 text-gray-900 focus:outline-none rounded-r-lg" />
            </div>

            <div className="flex items-center border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 border">
              <Mail className="text-gray-400 m-3" />
              <input aria-label="email" name="email" type="email" placeholder="Your Email" required value={form.email} onChange={handleChange} className="min-w-0 flex-1 p-3 placeholder-gray-500 text-gray-900 focus:outline-none rounded-r-lg" />
            </div>

            <div className="flex items-center border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 border">
              <Phone className="text-gray-400 m-3" />
              <input aria-label="phone" name="phone" type="tel" placeholder="Phone Number" required value={form.phone} onChange={handleChange}  pattern="^[0-9]{10}$"
              title="Phone number should be 10 digits" className="min-w-0 flex-1 p-3 placeholder-gray-500 text-gray-900 focus:outline-none rounded-r-lg" />
            </div>
             { form.course &&
             <div className="flex items-center border-gray-200 rounded-lg border focus-within:ring-2 focus-within:ring-blue-500">
              <Book className="text-gray-400 m-3" />
              <input aria-label="course" name="course" required type="text" placeholder="Requested Course" value={form.course} readOnly className="min-w-0 flex-1 p-3 bg-gray-100 text-gray-900 rounded-r-lg" />
            </div>
            }

            <div className="flex items-center border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 border">
              <Clock className="text-gray-400 m-3" />
              <input aria-label="preferredTime" name="preferredTime" type="text" placeholder="Preferred Time (e.g. Mon-Fri, 2-4pm)" required value={form.preferredTime} onChange={handleChange} className="min-w-0 flex-1 p-3 placeholder-gray-500 text-gray-900 focus:outline-none rounded-r-lg" />
            </div>

            <div className="flex items-start border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 border">
              <MessageSquare className="text-gray-400 m-3 mt-4" />
              <textarea aria-label="message" name="message" rows={4} placeholder="Additional Message (Optional)" value={form.message} onChange={handleChange} className="min-w-0 flex-1 p-3 placeholder-gray-500 text-gray-900 focus:outline-none rounded-r-lg" />
            </div>

            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={status === 'sending'} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
              {status === 'sending' ? 'Sending…' : 'Request Callback'}
            </motion.button>

            {status === 'error' && <p className="mt-2 text-red-600">Oops! Something went wrong.</p>}
          </form>
        </motion.div>
      </div>
    </section>
  )
}
