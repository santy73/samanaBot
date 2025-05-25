// composables/useChat.ts
import { v4 as uuidv4 } from 'uuid'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    isError?: boolean
}

interface ChatState {
    sessionId: string | null
    conversationId: string | null
    messages: Message[]
    isTyping: boolean
    suggestions: string[]
    currentBanner: any
    error: string | null
}

export const useChat = () => {
    const state = useState<ChatState>('chat', () => ({
        sessionId: null,
        conversationId: null,
        messages: [],
        isTyping: false,
        suggestions: [],
        currentBanner: null,
        error: null
    }))

    const config = useRuntimeConfig()
    const API_URL = config.public.apiUrl || 'http://localhost:3000/api'

    // Initialize session
    const initSession = () => {
        if (process.client) {
            const sessionId = state.value.sessionId || localStorage.getItem('chatSessionId') || uuidv4()
            state.value.sessionId = sessionId
            localStorage.setItem('chatSessionId', sessionId)
            return sessionId
        }
        return uuidv4()
    }

    // Initialize conversation
    const initConversation = async () => {
        try {
            const sessionId = initSession()

            const { data } = await $fetch(`${API_URL}/chat/conversations`, {
                method: 'POST',
                body: {
                    sessionId,
                    source: 'web'
                }
            })

            state.value.conversationId = data.conversationId

            // Add welcome message
            state.value.messages.push({
                id: uuidv4(),
                role: 'assistant',
                content: data.welcomeMessage || '¡Hola! Soy el asistente virtual de SamanaInn. ¿En qué puedo ayudarte hoy?',
                timestamp: new Date().toISOString()
            })

            return data
        } catch (error: any) {
            state.value.error = error.message || 'Error al iniciar conversación'
            throw error
        }
    }

    // Send message
    const sendMessage = async (message: string) => {
        if (!message.trim()) return

        // Add user message
        const userMessageId = uuidv4()
        state.value.messages.push({
            id: userMessageId,
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        })

        // Set typing indicator
        state.value.isTyping = true

        try {
            const { data } = await $fetch(`${API_URL}/chat/message`, {
                method: 'POST',
                body: {
                    conversationId: state.value.conversationId,
                    message,
                    context: { sessionId: state.value.sessionId }
                }
            })

            // Add assistant response
            state.value.messages.push({
                id: data.messageId,
                role: 'assistant',
                content: data.message,
                timestamp: new Date().toISOString()
            })

            // Update suggestions and banner if they exist
            if (data.suggestions) {
                state.value.suggestions = data.suggestions
            }

            if (data.banner) {
                state.value.currentBanner = data.banner
            }

            return data
        } catch (error: any) {
            state.value.error = error.message || 'Error al enviar mensaje'

            // Add error message
            state.value.messages.push({
                id: uuidv4(),
                role: 'assistant',
                content: 'Lo siento, tuve un problema procesando tu solicitud. ¿Podrías intentarlo de nuevo?',
                isError: true,
                timestamp: new Date().toISOString()
            })

            throw error
        } finally {
            state.value.isTyping = false
        }
    }

    // Load conversation history
    const loadConversationHistory = async () => {
        if (!state.value.conversationId) return

        try {
            const { data } = await $fetch(`${API_URL}/chat/conversations/${state.value.conversationId}/messages`)
            state.value.messages = data.messages
            return data
        } catch (error: any) {
            state.value.error = error.message || 'Error al cargar historial'
            throw error
        }
    }

    // Provide feedback
    const provideFeedback = async (messageId: string, helpful: boolean, feedback: string = '') => {
        try {
            await $fetch(`${API_URL}/chat/feedback`, {
                method: 'POST',
                body: {
                    messageId,
                    helpful,
                    feedback
                }
            })
        } catch (error: any) {
            state.value.error = error.message || 'Error al enviar feedback'
            throw error
        }
    }

    // End conversation
    const endConversation = async () => {
        if (!state.value.conversationId) return

        try {
            await $fetch(`${API_URL}/chat/conversations/${state.value.conversationId}/close`, {
                method: 'PUT'
            })
            state.value.conversationId = null
        } catch (error: any) {
            state.value.error = error.message || 'Error al finalizar conversación'
            throw error
        }
    }

    // Clear messages
    const clearMessages = () => {
        state.value.messages = []
    }

    // Computed properties
    const hasActiveConversation = computed(() => !!state.value.conversationId)
    const messageHistory = computed(() => state.value.messages)
    const isTyping = computed(() => state.value.isTyping)
    const currentSuggestions = computed(() => state.value.suggestions)
    const currentBanner = computed(() => state.value.currentBanner)
    const lastUserMessage = computed(() => {
        const userMessages = state.value.messages.filter(m => m.role === 'user')
        return userMessages.length ? userMessages[userMessages.length - 1] : null
    })
    const lastAssistantMessage = computed(() => {
        const assistantMessages = state.value.messages.filter(m => m.role === 'assistant')
        return assistantMessages.length ? assistantMessages[assistantMessages.length - 1] : null
    })

    return {
        // State
        messages: messageHistory,
        isTyping,
        suggestions: currentSuggestions,
        currentBanner,
        error: computed(() => state.value.error),

        // Actions
        initConversation,
        sendMessage,
        loadConversationHistory,
        provideFeedback,
        endConversation,
        clearMessages,

        // Getters
        hasActiveConversation,
        lastUserMessage,
        lastAssistantMessage
    }
}