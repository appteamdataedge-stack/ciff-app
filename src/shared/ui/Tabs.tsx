import type { ReactNode } from 'react'
import { useState } from 'react'

export type Tab = { id: string; label: string; content: ReactNode; disabled?: boolean }

function Tabs({ tabs, defaultTab }: { tabs: Tab[]; defaultTab?: string }) {
  const [active, setActive] = useState<string>(defaultTab || tabs[0]?.id)
  return (
    <div>
      <div className="flex gap-2 border-b bg-white rounded-t-lg px-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            disabled={t.disabled}
            onClick={() => setActive(t.id)}
            className={`px-3 py-2 text-sm border-b-2 -mb-px ${active === t.id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'} ${t.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="bg-white border border-t-0 rounded-b-lg p-4">
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  )
}

export default Tabs


