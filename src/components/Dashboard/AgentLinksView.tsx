import React, { useState } from 'react'
import {
  Bot, Copy, Check, Plus, Shield, ShieldOff,
  Trash2, Clock, MessageSquare, Lock, ChevronDown,
  ChevronRight, X, AlertTriangle, Zap, Link2
} from 'lucide-react'

interface AgentLink {
  id: string
  label: string
  token: string
  topics: string[]
  rateLimit: number
  expiresAt: string | null
  createdAt: string
  messageCount: number
  status: 'active' | 'paused' | 'revoked'
}

const BASE_URL = 'https://pcg.app/connect/nora'

const TOPIC_OPTIONS = ['General Q&A', 'Pricing', 'Availability', 'Services', 'Support', 'Booking', 'Portfolio']

const RATE_OPTIONS = [
  { value: 5, label: '5 / hour — minimal' },
  { value: 20, label: '20 / hour — standard' },
  { value: 100, label: '100 / hour — high traffic' },
]

const EXPIRY_OPTIONS = [
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: null, label: 'Never expires' },
]

const INITIAL_LINKS: AgentLink[] = [
  {
    id: '1',
    label: 'Veritwin Website Bot',
    token: 'nra_vt_7f3k9p2mxq8nw4',
    topics: ['Services', 'Pricing', 'Availability'],
    rateLimit: 20,
    expiresAt: '2026-07-10',
    createdAt: '2026-06-01',
    messageCount: 47,
    status: 'active',
  },
  {
    id: '2',
    label: 'Demo / Test Channel',
    token: 'nra_demo_1a2b3c4d5e6f',
    topics: ['General Q&A'],
    rateLimit: 5,
    expiresAt: null,
    createdAt: '2026-05-20',
    messageCount: 12,
    status: 'active',
  },
]

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
      title="Copy"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
    </button>
  )
}

function TopicTag({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-100">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-blue-900">
          <X size={10} />
        </button>
      )}
    </span>
  )
}

function StatusPill({ status }: { status: AgentLink['status'] }) {
  const map = {
    active: 'bg-green-50 text-green-700 border-green-200',
    paused: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    revoked: 'bg-red-50 text-red-600 border-red-200',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${map[status]}`}>
      {status}
    </span>
  )
}

function SecurityPanel() {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <Shield size={18} className="text-blue-600" />
          <span className="font-semibold text-gray-800">Security model — what Nora can and cannot do via agent links</span>
        </div>
        {open ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Check size={14} className="text-green-600" />
              <span className="text-sm font-semibold text-green-700">Nora CAN</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                'Answer questions within the approved topics for that link',
                'Provide publicly available information about your services',
                'Say "I don\'t know" or redirect out-of-scope questions',
                'Return structured JSON responses to the calling agent',
                'Identify herself as Nora and describe her capabilities',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldOff size={14} className="text-red-500" />
              <span className="text-sm font-semibold text-red-600">Nora CANNOT</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                'Access any dashboard data, client records, or internal metrics',
                'Trigger any actions, tasks, or workflows on the network',
                'Persist context between messages — every call is stateless',
                'Receive or store information about the calling agent\'s system',
                'Exceed the rate limit set for the link',
                'Respond to topics not in the approved list for that link',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-full border-t pt-4 mt-1">
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
              <span>
                These constraints are enforced at the channel level — Nora's system prompt in agent-link mode contains no dashboard access, and the API handler strips all internal context before it reaches her. Prompt injection attempts are detected and the message is rejected with a 403.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProtocolPanel() {
  const [open, setOpen] = useState(false)
  const discoveryExample = `GET ${BASE_URL}?t=YOUR_TOKEN

// Returns the Agent Card:
{
  "agent": "Nora",
  "version": "1.0",
  "topics": ["Services", "Pricing"],
  "rateLimit": { "requests": 20, "window": "1h" },
  "capabilities": ["chat"],
  "actions": []
}`

  const chatExample = `POST ${BASE_URL}?t=YOUR_TOKEN
Content-Type: application/json

{
  "agent_id": "my-agent-v1",
  "intent": "pricing_inquiry",
  "message": "What are your monthly retainer options?"
}

// Response:
{
  "response": "Our monthly retainers start at...",
  "topic_matched": "Pricing",
  "quota_remaining": 19
}`

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <Zap size={18} className="text-purple-600" />
          <span className="font-semibold text-gray-800">Agent protocol — how to call Nora from another agent</span>
        </div>
        {open ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600">
            Share the link and the receiving agent can discover Nora's capabilities, then send messages. Two calls total — no SDK required.
          </p>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">1 — Discovery (GET)</div>
            <pre className="bg-gray-950 text-green-400 text-xs rounded-lg p-4 overflow-x-auto leading-relaxed">{discoveryExample}</pre>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">2 — Send a message (POST)</div>
            <pre className="bg-gray-950 text-green-400 text-xs rounded-lg p-4 overflow-x-auto leading-relaxed">{chatExample}</pre>
          </div>
          <div className="text-xs text-gray-400">
            The <code className="bg-gray-100 px-1 rounded">agent_id</code> and <code className="bg-gray-100 px-1 rounded">intent</code> fields are logged for your audit trail but never passed to Nora's prompt.
          </div>
        </div>
      )}
    </div>
  )
}

function CreateLinkModal({ onClose, onCreate }: { onClose: () => void; onCreate: (link: AgentLink) => void }) {
  const [label, setLabel] = useState('')
  const [topics, setTopics] = useState<string[]>(['General Q&A'])
  const [rateLimit, setRateLimit] = useState(20)
  const [expiry, setExpiry] = useState<string | null>('30d')

  const toggleTopic = (t: string) => {
    setTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const submit = () => {
    if (!label.trim() || topics.length === 0) return
    const token = 'nra_' + Math.random().toString(36).slice(2, 16)
    onCreate({
      id: Date.now().toString(),
      label: label.trim(),
      token,
      topics,
      rateLimit,
      expiresAt: expiry ? new Date(Date.now() + (expiry === '24h' ? 86400000 : expiry === '7d' ? 604800000 : 2592000000)).toISOString().slice(0, 10) : null,
      createdAt: new Date().toISOString().slice(0, 10),
      messageCount: 0,
      status: 'active',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Create Agent Link</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Label <span className="text-gray-400">(for your reference)</span></label>
          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="e.g. Client website bot"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Approved topics <span className="text-red-400">*</span></label>
          <p className="text-xs text-gray-500">Nora will only answer questions matching these topics — everything else gets a polite redirect.</p>
          <div className="flex flex-wrap gap-2">
            {TOPIC_OPTIONS.map(t => (
              <button
                key={t}
                onClick={() => toggleTopic(t)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  topics.includes(t)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Rate limit</label>
          <select
            value={rateLimit}
            onChange={e => setRateLimit(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {RATE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Expires</label>
          <select
            value={expiry ?? 'never'}
            onChange={e => setExpiry(e.target.value === 'never' ? null : e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {EXPIRY_OPTIONS.map(o => (
              <option key={String(o.value)} value={o.value ?? 'never'}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
          <button
            onClick={submit}
            disabled={!label.trim() || topics.length === 0}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Generate link
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AgentLinksView() {
  const [links, setLinks] = useState<AgentLink[]>(INITIAL_LINKS)
  const [showCreate, setShowCreate] = useState(false)

  const addLink = (link: AgentLink) => setLinks(prev => [link, ...prev])

  const revokeLink = (id: string) =>
    setLinks(prev => prev.map(l => l.id === id ? { ...l, status: 'revoked' as const } : l))

  const activeCount = links.filter(l => l.status === 'active').length
  const totalMessages = links.reduce((s, l) => s + l.messageCount, 0)

  return (
    <div className="space-y-6">
      {showCreate && (
        <CreateLinkModal onClose={() => setShowCreate(false)} onCreate={addLink} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bot size={24} className="text-blue-600" />
            Nora Agent Interface
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Share a link — let another agent talk to Nora in a locked-down, read-only channel.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          New agent link
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Link2 size={14} />
            Active links
          </div>
          <div className="text-2xl font-bold text-gray-900">{activeCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <MessageSquare size={14} />
            Agent messages handled
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalMessages}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Lock size={14} />
            Nora's data access
          </div>
          <div className="text-lg font-bold text-green-700">Zero</div>
          <div className="text-xs text-gray-400">via agent channel</div>
        </div>
      </div>

      {/* Security model */}
      <SecurityPanel />

      {/* Active links table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Agent links</h2>
          <span className="text-xs text-gray-400">{links.length} total</span>
        </div>

        {links.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            No agent links yet. Create one to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {links.map(link => {
              const shareUrl = `${BASE_URL}?t=${link.token}`
              return (
                <div key={link.id} className={`px-5 py-4 ${link.status === 'revoked' ? 'opacity-50' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900 text-sm">{link.label}</span>
                        <StatusPill status={link.status} />
                      </div>

                      {/* Shareable URL */}
                      {link.status === 'active' && (
                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 max-w-lg">
                          <span className="text-xs text-gray-500 font-mono truncate flex-1">{shareUrl}</span>
                          <CopyButton value={shareUrl} />
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock size={11} />
                          Created {link.createdAt}
                          {link.expiresAt && ` · expires ${link.expiresAt}`}
                          {!link.expiresAt && ' · never expires'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap size={11} />
                          {link.rateLimit} msg/hr limit
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare size={11} />
                          {link.messageCount} messages total
                        </div>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-1.5">
                        {link.topics.map(t => <TopicTag key={t} label={t} />)}
                      </div>
                    </div>

                    {/* Actions */}
                    {link.status !== 'revoked' && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => revokeLink(link.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Revoke link"
                        >
                          <Trash2 size={13} />
                          Revoke
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Protocol docs */}
      <ProtocolPanel />
    </div>
  )
}
