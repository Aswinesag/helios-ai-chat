import { useEffect, useRef, useState } from 'react'
import AssistantResponse from './components/AssistantResponse.jsx'
import Auth from './components/Auth.jsx'
import ErrorBanner from './components/ErrorBanner.jsx'
import Header from './components/Header.jsx'
import { PromptForm } from './components/PromptForm.jsx'
import QuickActions from './components/QuickActions.jsx'
import Sidebar from './components/Sidebar.jsx'
import { MODELS, NOVA_FILE_MODEL_ID, VISION_MODELS_IDS } from './constants/models.js'
import { useAuth } from './context/AuthContext'
import { supabase } from './lib/supabase'

function App() {
  const { user, loading: authLoading } = useAuth()
  
  // Core state
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState(MODELS[0])
  const [imageData, setImageData] = useState(null)
  const [fileAttachment, setFileAttachment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Session state
  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Conversation state
  const [conversations, setConversations] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [displayedAnswer, setDisplayedAnswer] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [clearingConversations, setClearingConversations] = useState(false)
  
  // Refs
  const imageInputRef = useRef(null)
  const fileInputRef = useRef(null)
  const conversationEndRef = useRef(null)

  // Model type checks
  const isVisionModel = VISION_MODELS_IDS.has(selectedModel.id)
  const isNovaFileModel = selectedModel.id === NOVA_FILE_MODEL_ID

  // Session management function
  const createNewSession = async () => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: 'New Chat'
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating session:', error)
        // Check if it's a table doesn't exist error
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          setError('Database table not found. Please run the SQL migration in Supabase dashboard.')
        } else {
          setError(`Failed to create new chat session: ${error.message}`)
        }
        return null
      }

      setSessions(prev => [data, ...prev])
      setCurrentSessionId(data.id)
      setConversations([])
      setSidebarOpen(false) // Close sidebar on mobile after selection
      return data.id
    } catch (err) {
      console.error('Error creating session:', err)
      setError('Failed to create new chat session')
      return null
    }
  }

  // Load sessions when user logs in
  useEffect(() => {
    if (!user) {
      setSessions([])
      setCurrentSessionId(null)
      setLoadingSessions(false)
      return
    }

    const loadSessions = async () => {
      try {
        setLoadingSessions(true)
        setError('') // Clear any previous errors
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })

        if (error) {
          console.error('Error loading sessions:', error)
          // Check if it's a table doesn't exist error
          if (error.code === '42P01' || error.message?.includes('does not exist')) {
            setError('Database table not found. Please run the SQL migration in Supabase.')
          } else {
            setError(`Failed to load chat sessions: ${error.message}`)
          }
          // Still allow the app to work by creating a session in memory
          await createNewSession()
        } else {
          setSessions(data || [])
          // Select the most recent session or create a new one
          if (data && data.length > 0) {
            setCurrentSessionId(data[0].id)
          } else {
            // Create a new session if none exist
            await createNewSession()
          }
        }
      } catch (err) {
        console.error('Error loading sessions:', err)
        setError(`Failed to load chat sessions: ${err.message}`)
        // Try to create a session anyway
        try {
          await createNewSession()
        } catch (createErr) {
          console.error('Failed to create fallback session:', createErr)
        }
      } finally {
        setLoadingSessions(false)
      }
    }

    loadSessions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Load conversations for current session
  useEffect(() => {
    if (!user || !currentSessionId) {
      setConversations([])
      setLoadingConversations(false)
      return
    }

    const loadConversations = async () => {
      try {
        setLoadingConversations(true)
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('session_id', currentSessionId)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Error loading conversations:', error)
          setError('Failed to load conversation history')
        } else {
          // Map database records to conversation format
          const loadedConversations = (data || []).map(conv => {
            const model = MODELS.find(m => m.id === conv.model_id) || MODELS[0]
            return {
              id: conv.id,
              prompt: conv.prompt,
              answer: conv.answer,
              model: model,
              timestamp: conv.created_at
            }
          })
          setConversations(loadedConversations)
        }
      } catch (err) {
        console.error('Error loading conversations:', err)
        setError('Failed to load conversation history')
      } finally {
        setLoadingConversations(false)
      }
    }

    loadConversations()
  }, [user, currentSessionId])

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (!user) return // Only run when user is authenticated
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations, displayedAnswer, user])

  // Typing animation effect
  useEffect(() => {
    if (!user) return // Only run when user is authenticated
    if (!isTyping || !currentAnswer) return

    const typingInterval = setInterval(() => {
      setDisplayedAnswer(prev => {
        if (prev.length >= currentAnswer.length) {
          setIsTyping(false)
          return currentAnswer
        }
        return currentAnswer.slice(0, prev.length + 1)
      })
    }, 10)

    return () => clearInterval(typingInterval)
  }, [isTyping, currentAnswer, user])

  // Early returns after all hooks
  if (authLoading) {
    return <div className="text-white text-center mt-20">Loading...</div>
  }

  if (!user) {
    return <Auth />
  }

  // Event handlers
  const handlePromptChange = (value) => setPrompt(value)
  
  const handleModelChange = (modelId) => {
    const model = MODELS.find(m => m.id === modelId)
    setSelectedModel(model)
    // Clear attachments when switching model types
    if (!isVisionModel) clearImage()
    if (!isNovaFileModel) clearFile()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImageData(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setFileAttachment(file)
  }

  const clearImage = () => {
    setImageData(null)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const clearFile = () => {
    setFileAttachment(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleQuickAction = (quickPrompt) => {
    setPrompt(quickPrompt)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Session management handlers
  const handleSessionCreate = async () => {
    await createNewSession()
  }

  const handleSessionSelect = (sessionId) => {
    setCurrentSessionId(sessionId)
    setSidebarOpen(false) // Close sidebar on mobile after selection
  }

  const handleSessionDelete = async (sessionId) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting session:', error)
        setError('Failed to delete chat session')
        return
      }

      setSessions(prev => prev.filter(s => s.id !== sessionId))
      
      // If deleted session was current, switch to another or create new
      if (currentSessionId === sessionId) {
        const remainingSessions = sessions.filter(s => s.id !== sessionId)
        if (remainingSessions.length > 0) {
          setCurrentSessionId(remainingSessions[0].id)
        } else {
          createNewSession()
        }
      }
    } catch (err) {
      console.error('Error deleting session:', err)
      setError('Failed to delete chat session')
    }
  }

  const handleSessionRename = async (sessionId, newTitle) => {
    if (!user || !newTitle.trim()) return

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title: newTitle.trim() })
        .eq('id', sessionId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error renaming session:', error)
        setError('Failed to rename chat session')
        return
      }

      setSessions(prev => 
        prev.map(s => s.id === sessionId ? { ...s, title: newTitle.trim() } : s)
      )
    } catch (err) {
      console.error('Error renaming session:', err)
      setError('Failed to rename chat session')
    }
  }

  // API call function
  const callAPI = async () => {
    const messages = []
    
    // Add conversation history
    conversations.forEach(conv => {
      messages.push({ role: 'user', content: conv.prompt })
      messages.push({ role: 'assistant', content: conv.answer })
    })
    
    // Add current prompt with proper content structure
    if (imageData && isVisionModel) {
      // For vision models, content must be an array with text and image
      messages.push({ 
        role: 'user', 
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageData } }
        ]
      })
    } else {
      // For text-only models, content is a string
      let finalPrompt = prompt
      if (fileAttachment) {
        finalPrompt = `${prompt}\n\nFile attached: ${fileAttachment.name}`
      }
      messages.push({ role: 'user', content: finalPrompt })
    }

    const requestBody = {
      model: selectedModel.id,
      messages: messages
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API Error: ${response.status}`)
      }

      const data = await response.json()
      return data.content
    } catch (err) {
      throw new Error(err.message || 'Failed to get response from API')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!prompt.trim() && !imageData && !fileAttachment) {
      setError('Please enter a prompt or attach a file')
      return
    }

    setLoading(true)
    setError('')
    setCurrentAnswer('')
    setDisplayedAnswer('')
    setIsTyping(false)

    try {
      // Call API
      const answer = await callAPI()
      
      // Ensure we have a session
      let sessionId = currentSessionId
      if (!sessionId) {
        sessionId = await createNewSession()
        if (!sessionId) {
          throw new Error('Failed to create session')
        }
      }

      // Save to Supabase
      const { data: savedConv, error: saveError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          prompt: prompt,
          answer: answer,
          model_id: selectedModel.id
        })
        .select()
        .single()

      // Update session's updated_at timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId)

      // Update sessions list to reflect the updated timestamp
      setSessions(prev => {
        const updated = prev.map(s => 
          s.id === sessionId 
            ? { ...s, updated_at: new Date().toISOString() }
            : s
        )
        // Move updated session to top
        const session = updated.find(s => s.id === sessionId)
        const others = updated.filter(s => s.id !== sessionId)
        return session ? [session, ...others] : updated
      })

      if (saveError) {
        console.error('Error saving conversation:', saveError)
        // Still add to local state even if save fails
        setError('Failed to save conversation, but response received')
      }

      // Add to conversation (use saved data if available, otherwise create local object)
      const newConversation = savedConv ? {
        id: savedConv.id,
        prompt: savedConv.prompt,
        answer: savedConv.answer,
        model: selectedModel,
        timestamp: savedConv.created_at
      } : {
        prompt: prompt,
        answer: answer,
        model: selectedModel,
        timestamp: new Date().toISOString()
      }
      
      setConversations(prev => [...prev, newConversation])
      
      // Start typing animation
      setCurrentAnswer(answer)
      setIsTyping(true)
      
      // Clear form
      setPrompt('')
      clearImage()
      clearFile()
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const clearConversation = async () => {
    if (!user || !currentSessionId || clearingConversations) return

    try {
      setClearingConversations(true)
      // Delete all conversations from current session
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('session_id', currentSessionId)

      if (error) {
        console.error('Error deleting conversations:', error)
        setError('Failed to delete conversation history')
        return
      }

      // Clear local state
      setConversations([])
      setCurrentAnswer('')
      setDisplayedAnswer('')
      setIsTyping(false)
      setError('')
    } catch (err) {
      console.error('Error clearing conversations:', err)
      setError('Failed to clear conversation history')
    } finally {
      setClearingConversations(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onSessionCreate={handleSessionCreate}
        onSessionDelete={handleSessionDelete}
        onSessionRename={handleSessionRename}
        loading={loadingSessions}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sidebar toggle button - shown when sidebar is closed */}
        {!sidebarOpen && (
          <div className="fixed top-4 left-4 z-30 group">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors shadow-lg"
              aria-label="Open sidebar"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {/* Tooltip */}
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black/90 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap">
                Open sidebar
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/90"></div>
              </div>
            </div>
          </div>
        )}

        <Header selectedModel={selectedModel} user={user} onSignOut={signOut} />
        
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:px-6">
        {/* Error Banner */}
        {error && <ErrorBanner message={error} />}
        
        {/* Conversation History */}
        {loadingConversations ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-zinc-400 text-sm mt-2">Loading conversation history...</p>
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            {conversations.map((conv) => (
              <div key={conv.id || conv.timestamp} className="space-y-4">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-2xl bg-blue-600/20 border border-blue-500/30 rounded-2xl px-4 py-3 backdrop-blur-sm">
                  <p className="text-zinc-100 text-sm sm:text-base">{conv.prompt}</p>
                </div>
              </div>
              
              {/* Assistant Response */}
              <AssistantResponse 
                answer={conv.answer} 
                displayedAnswer={conv.answer}
                selectedModel={conv.model}
              />
              </div>
            ))}
            
            {/* Current Typing Response */}
            {isTyping && (
              <AssistantResponse 
                answer={currentAnswer}
                displayedAnswer={displayedAnswer}
                selectedModel={selectedModel}
              />
            )}
          </div>
        )}

        {/* Quick Actions - Show when no conversations */}
        {conversations.length === 0 && !loading && (
          <div className="mb-8">
            <QuickActions onselect={handleQuickAction} />
          </div>
        )}

        {/* Prompt Form */}
        <PromptForm
          prompt={prompt}
          onPromptChange={handlePromptChange}
          onSubmit={handleSubmit}
          models={MODELS}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          isVisionModel={isVisionModel}
          isNovaFileModel={isNovaFileModel}
          onImageChange={handleImageChange}
          onFileChange={handleFileChange}
          imageData={imageData}
          fileAttachment={fileAttachment}
          clearImage={clearImage}
          clearFile={clearFile}
          loading={loading}
          imageInputRef={imageInputRef}
          fileInputRef={fileInputRef}
        />

        {/* Clear Conversation Button */}
        {conversations.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={clearConversation}
              disabled={clearingConversations}
              className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {clearingConversations ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Clearing...
                </span>
              ) : (
                'Clear Conversation'
              )}
            </button>
          </div>
        )}
        
        {/* Scroll Anchor */}
        <div ref={conversationEndRef} />
        </main>
      </div>
    </div>
  )
}

export default App
