'use client'

import { useState } from 'react'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { Button } from '@/components/ui/button'
import { Send, Loader2, CheckCircle2, AlertCircle, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    setSending(true); setError('')
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...form }),
      })
      setSent(true)
    } catch {
      setError('Failed to send. Please try again.')
    } finally { setSending(false) }
  }

  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <section className="bg-navy py-14">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-bold text-white">Contact Us</h1>
            <p className="mt-2 text-white/60">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
        </section>
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-navy mb-2">Message Sent!</h2>
                  <p className="text-gray-500 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <Button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }} variant="outline" className="rounded-xl">Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-lg font-bold text-navy mb-4">Send a Message</h2>
                  {error && <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="How can we help?" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red resize-none" />
                  </div>
                  <Button type="submit" disabled={sending} className="w-full bg-accent-red hover:bg-accent-red-dark text-white rounded-xl" size="lg">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Info sidebar */}
            <div className="space-y-6">
              {[
                { icon: Mail, title: 'Email', lines: ['hello@lovekorea.us', 'For sellers: sellers@lovekorea.us'] },
                { icon: MapPin, title: 'Location', lines: ['Los Angeles, CA, USA', 'Seoul, South Korea'] },
                { icon: Clock, title: 'Response Time', lines: ['We typically respond within', '24 business hours'] },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-red/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-accent-red" />
                    </div>
                    <h3 className="font-semibold text-navy">{item.title}</h3>
                  </div>
                  {item.lines.map((l, i) => <p key={i} className="text-sm text-gray-500">{l}</p>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <GlobalFooter />
    </>
  )
}
