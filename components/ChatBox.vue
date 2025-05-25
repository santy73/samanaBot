<!-- components/ChatBox.vue -->
<template>
    <div class="chat-box-container" :class="{ compact }">
        <!-- Historial de mensajes -->
        <div class="chat-messages" ref="messagesContainer">
            <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
                <div class="message-content">
                    <div v-if="message.role === 'assistant'" class="assistant-avatar">AI</div>
                    <div v-html="formatMessage(message.content)"></div>
                </div>
                <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>

            <!-- Indicador de escritura -->
            <div v-if="isTyping" class="message assistant typing">
                <div class="message-content">
                    <div class="assistant-avatar">AI</div>
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>

            <!-- Desplazamiento automático al final -->
            <div ref="messagesEnd"></div>
        </div>

        <!-- Sugerencias -->
        <div v-if="suggestions && suggestions.length > 0" class="chat-suggestions">
            <button v-for="(suggestion, idx) in suggestions" :key="idx" class="suggestion-button"
                @click="$emit('suggestion-click', suggestion)">
                {{ suggestion }}
            </button>
        </div>

        <!-- Área de entrada de mensaje -->
        <div class="chat-input-area">
            <input v-model="userMessage" type="text" placeholder="Escribe tu mensaje aquí..." @keyup.enter="sendMessage"
                :disabled="isTyping" class="chat-input" />
            <button @click="sendMessage" :disabled="!userMessage.trim() || isTyping" class="send-button">
                <span>↑</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: string
}

interface Props {
    messages?: Message[]
    isTyping?: boolean
    suggestions?: string[]
    compact?: boolean
}

interface Emits {
    (e: 'send-message', message: string): void
    (e: 'suggestion-click', suggestion: string): void
}

const props = withDefaults(defineProps<Props>(), {
    messages: () => [],
    isTyping: false,
    suggestions: () => [],
    compact: false
})

const emit = defineEmits<Emits>()

const userMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const messagesEnd = ref<HTMLElement>()

const sendMessage = () => {
    if (!userMessage.value.trim() || props.isTyping) return

    emit('send-message', userMessage.value)
    userMessage.value = ''
}

const scrollToBottom = () => {
    const container = messagesContainer.value
    const end = messagesEnd.value

    if (container && end) {
        container.scrollTop = container.scrollHeight
    }
}

const formatMessage = (text: string) => {
    // Procesar URLs
    const urlPattern = /(https?:\/\/[^\s]+)/g
    return text
        .replace(urlPattern, '<a href="$1" target="_blank">$1</a>')
        .replace(/\n/g, '<br>')
}

const formatTime = (timestamp: string) => {
    if (!timestamp) return ''

    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

watch(
    () => props.messages,
    () => {
        nextTick(() => {
            scrollToBottom()
        })
    },
    { deep: true }
)

watch(
    () => props.isTyping,
    () => {
        nextTick(() => {
            scrollToBottom()
        })
    }
)

onMounted(() => {
    scrollToBottom()
})
</script>