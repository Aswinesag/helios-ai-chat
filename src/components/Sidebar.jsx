import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { FaPlus, FaTrash, FaEdit, FaTimes, FaCheck, FaChevronLeft } from 'react-icons/fa'

const Sidebar = ({ 
  isOpen, 
  onToggle, 
  sessions, 
  currentSessionId, 
  onSessionSelect, 
  onSessionCreate, 
  onSessionDelete,
  onSessionRename,
  loading 
}) => {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const editInputRef = useRef(null)

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  const handleStartEdit = (session) => {
    setEditingId(session.id)
    setEditName(session.title)
  }

  const handleSaveEdit = async (sessionId) => {
    if (!editName.trim()) {
      setEditingId(null)
      return
    }

    await onSessionRename(sessionId, editName.trim())
    setEditingId(null)
    setEditName('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleKeyDown = (e, sessionId) => {
    if (e.key === 'Enter') {
      handleSaveEdit(sessionId)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-zinc-900 border-r border-zinc-800 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64 flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={onToggle}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onSessionCreate}
            className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="inline-block w-5 h-5 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-zinc-500 text-sm">No chat sessions yet</p>
              <p className="text-zinc-600 text-xs mt-1">Create a new chat to get started</p>
            </div>
          ) : (
            <div className="p-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`
                    group relative mb-1 rounded-lg transition-colors
                    ${currentSessionId === session.id 
                      ? 'bg-zinc-800' 
                      : 'hover:bg-zinc-800/50'
                    }
                  `}
                >
                  {editingId === session.id ? (
                    <div className="p-2 flex items-center gap-2">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, session.id)}
                        onBlur={() => handleSaveEdit(session.id)}
                        className="flex-1 px-2 py-1 bg-zinc-700 text-white text-sm rounded border border-zinc-600 focus:border-blue-500 focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={() => handleSaveEdit(session.id)}
                        className="p-1 text-green-400 hover:text-green-300"
                      >
                        <FaCheck className="w-3 h-3" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <button
                        onClick={() => onSessionSelect(session.id)}
                        className="flex-1 px-3 py-2 text-left text-sm text-zinc-300 hover:text-white truncate"
                      >
                        <div className="font-medium truncate">{session.title}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {formatDate(session.updated_at || session.created_at)}
                        </div>
                      </button>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 pr-2 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(session)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-300 rounded"
                          title="Rename"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onSessionDelete(session.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 rounded"
                          title="Delete"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
