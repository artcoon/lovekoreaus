'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const categories = [
  'All Categories',
  'Beauty & Cosmetics',
  'Food & Health',
  'Fashion & Lifestyle',
  'Culture & Goods',
  'Business & Trade',
]

const markets = ['All Markets', 'US', 'Japan', 'China', 'Global']
const types = ['All Types', 'Manufacturer', 'Brand', 'Distributor', 'Small Business', 'Service']

function FilterSection({ title, options }: { title: string; options: string[] }) {
  const [selected, setSelected] = useState(options[0])

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-navy mb-3">{title}</h3>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name={title}
              checked={selected === opt}
              onChange={() => setSelected(opt)}
              className="w-4 h-4 text-accent-red border-gray-300 focus:ring-accent-red"
            />
            <span className="text-sm text-gray-600 group-hover:text-navy">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function DirectoryFilters() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-navy mb-6">Filters</h2>
        <FilterSection title="Category" options={categories} />
        <FilterSection title="Target Market" options={markets} />
        <FilterSection title="Business Type" options={types} />
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-navy mb-3">Certifications</h3>
          {['FDA', 'HACCP', 'ISO', 'KOTRA Verified'].map((cert) => (
            <label key={cert} className="flex items-center gap-2 cursor-pointer mb-2 group">
              <input type="checkbox" className="w-4 h-4 rounded text-accent-red border-gray-300 focus:ring-accent-red" />
              <span className="text-sm text-gray-600 group-hover:text-navy">{cert}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
