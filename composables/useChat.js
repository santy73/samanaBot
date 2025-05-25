
import chatService from '~/services/chatService'

export function useChat() {
    const conversationId = ref(null)
    const messages = ref([])

    const initChat = async (sessionId) => {
        const { data } = await chatService.initConversation(sessionId)
        conversationId.value = data.conversationId
    }

    const sendMessage = async (message, context = {}) => {
        if (!conversationId.value) return
        const { data } = await chatService.sendMessage(conversationId.value, message, context)
        messages.value.push(data)
        return data
    }

    const fetchHistory = async () => {
        if (!conversationId.value) return
        const { data } = await chatService.getConversationHistory(conversationId.value)
        messages.value = data
    }

    const endChat = async () => {
        if (!conversationId.value) return
        await chatService.endConversation(conversationId.value)
        conversationId.value = null
    }

    return {
        conversationId,
        messages,
        initChat,
        sendMessage,
        fetchHistory,
        endChat,
    }
}
