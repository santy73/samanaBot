<template>
    <div class="chatbox">
        <div class="chat-messages" ref="messagesEnd">
            <div v-for="(msg, i) in messages" :key="i" :class="['chat-message', msg.isUser ? 'from-user' : 'from-bot']">
                <div class="chat-avatar">
                    <span v-if="msg.isUser">🧑</span>
                    <span v-else>🤖</span>
                </div>
                <div class="chat-bubble">{{ msg.text }}</div>
            </div>
        </div>
        <form class="chat-form" @submit.prevent="onSend">
            <input v-model="userInput" type="text" class="chat-input" placeholder="Escribe tu mensaje…"
                :disabled="sending" @keydown.enter="onSend" autocomplete="off" />
            <button class="chat-send" :disabled="sending || !userInput.trim()" type="submit">
                Enviar
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
const { messages, sendMessage, fetchHistory, conversationId, initChat } = useChat()

const userInput = ref('')
const sending = ref(false)
const messagesEnd = ref(null)

onMounted(async () => {
    const sessionId = localStorage.getItem('sessionId') || Date.now().toString()
    localStorage.setItem('sessionId', sessionId)
    await initChat(sessionId)
    await fetchHistory()
})

watch(messages, async () => {
    await nextTick()
    if (messagesEnd.value) {
        messagesEnd.value.scrollTop = messagesEnd.value.scrollHeight
    }
})

const onSend = async () => {
    if (!userInput.value.trim() || sending.value) return
    sending.value = true
    try {
        await sendMessage(userInput.value)
        userInput.value = ''
    } finally {
        sending.value = false
    }
}
</script>

<style scoped>
.chatbox {
    background: #f8f9fa;
    border-radius: 18px;
    box-shadow: 0 2px 8px #0001;
    padding: 1rem;
    max-width: 540px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    height: 450px;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 1rem;
    padding-right: 4px;
}

.chat-message {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
}

.from-user {
    flex-direction: row-reverse;
}

.chat-avatar {
    font-size: 1.4em;
    margin: 0 8px;
}

.chat-bubble {
    padding: 10px 14px;
    background: #e9ecef;
    border-radius: 16px;
    font-size: 1rem;
    max-width: 75%;
    word-break: break-word;
}

.from-user .chat-bubble {
    background: #cce5ff;
    color: #125488;
}

.chat-form {
    display: flex;
    gap: 8px;
}

.chat-input {
    flex: 1;
    border-radius: 12px;
    border: 1px solid #d0d7de;
    padding: 0.7rem;
    font-size: 1rem;
}

.chat-send {
    border-radius: 12px;
    background: #2563eb;
    color: #fff;
    border: none;
    padding: 0 1.4em;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
}

.chat-send:disabled {
    background: #a5b4fc;
    cursor: not-allowed;
}
</style>
