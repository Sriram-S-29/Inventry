import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const menuData = [
  {
    id: '1',
    label: '📊  Dashboard',
    path: '/dashboard', 
  },
  {
    id: '2',
    label: ' ↙️ Purchase',
    children: [
      { id: '2.1', label: 'Vendor', path: '/vendors' },
      { id: '2.2', label: 'New Purchase', path: '/newPurchase' },
    ],
  },
  {
    id:'3',
    label: 'Items',
        children: [
          { id: '2.3.1', label: ' Items', path: '/items' },
          { id: '2.3.2', label: 'Modify Item', path: '/users/groups/moderators' },
        ],
  },
  {
    id: '4',
    label: ' ↗️ Outgoing',
    children: [
      { id: '4.1', label: '🏬 Departments', path: '/departments' },
      { id: '4.2', label: 'New Outgoing➕', path: '/outgoing' },
    ],
  },
]

const MenuItem = ({ item, level = 0 }) => {
  const [expanded, setExpanded] = useState(false)
  const toggleExpand = useCallback(() => setExpanded(prev => !prev), [])
  
  const navigate = useNavigate()  
  

  const handleClick = () => {
    if (item.path) {
      navigate(item.path) 
    } else {
      toggleExpand()
    }
  }

  return (
    <div >
      <div
        className={`text-[13px] flex items-center justify-between py-2 px-4 cursor-pointer transition-all duration-300 ease-in-out ${
          level === 0 ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-blue-50'
        }`}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
        onClick={handleClick}
      >
        <span className="text-blue-800 transition-colors duration-300 ease-in-out">{item.label}</span>
        {item.children && (
          <span
            className={`w-4 h-4 flex items-center justify-center transition-transform duration-700 ease-in-out ${
              expanded ? 'rotate-180' : ''
            }`}
          >
            <svg className="w-3 h-3 fill-current text-blue-600" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </span>
        )}
      </div>
      {item.children && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            expanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {item.children.map(child => (
            <MenuItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Nav() {
  return (
    <div className="w-64 h-screen bg-blue-50 border-r border-blue-200 transition-all duration-300 ease-in-out">
      
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800 transition-colors duration-500 ease-in-out">🛒Inventry</h2>
        {menuData.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
