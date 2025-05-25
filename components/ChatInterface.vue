<!-- components/ChatInterface.vue -->
<template>
    <div class="chat-container">
        <!-- Banner dinámico
        <div class="banner" v-if="currentBanner">
            <div class="banner-content" :class="'banner-' + currentBanner.type">
                <h2>{{ currentBanner.title }}</h2>
                <p>{{ currentBanner.subtitle }}</p>
                <button v-if="currentBanner.action" @click="navigateTo(currentBanner.action.url)">
                    {{ currentBanner.action.text }}
                </button>
            </div>
        </div>

        <div class="banner">
            <div class="banner-image">
                <img src="/banner1.png" />
            </div>
        </div> -->

        <!-- Área de chat -->
        <div class="chat-area" ref="chatArea">
            <div v-if="messages.length === 0" class="welcome-message">
                <h3>¡Bienvenido a SamanaInn!</h3>
                <p>Puedo ayudarte a encontrar alojamiento, restaurantes, tours y actividades en Samaná, República
                    Dominicana. ¿En qué puedo asistirte hoy?</p>
            </div>

            <div v-for="(msg, index) in messages" :key="index" class="message" :class="msg.role">
                <div class="message-content">{{ msg.content }}</div>
                <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
            </div>

            <div v-if="isTyping" class="message assistant loading">
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>

        <!-- Área de resultados -->
        <div v-if="showResults" class="results-area">
            <h3>{{ resultsTitle }}</h3>

            <div class="results-list">
                <div v-for="(result, index) in results" :key="index" class="result-item" @click="selectResult(result)">
                    <div class="result-image" v-if="result.gallery">
                        <img :src="getFirstImage(result.gallery)" :alt="result.title" />
                    </div>
                    <div class="result-content">
                        <h4>{{ result.title }}</h4>
                        <p v-if="result.short_desc">{{ result.short_desc }}</p>
                        <p v-else-if="result.content" class="result-excerpt">
                            {{ truncateText(result.content, 150) }}
                        </p>
                        <div class="result-meta" v-if="result.price">
                            <span class="price">
                                {{ formatPrice(result.sale_price || result.price) }}
                                <span v-if="result.sale_price" class="original-price">{{ formatPrice(result.price)
                                }}</span>
                            </span>
                        </div>
                        <div class="result-meta" v-if="result.review_score">
                            <span class="stars">{{ formatStars(result.review_score) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="results.length === 0" class="no-results">
                No se encontraron resultados
            </div>

            <div v-if="bookingUrl" class="booking-action">
                <button class="btn-booking" @click="navigateTo(bookingUrl)">
                    {{ bookingButtonText || 'Ver disponibilidad' }}
                </button>
            </div>
        </div>

        <!-- Preguntas sugeridas -->
        <div v-if="qSuggestions.length > 0" class="suggested-questions">
            <button v-for="(question, index) in qSuggestions" :key="index" class="btn-question"
                @click="sendSuggestedQuestion(question)">
                {{ question }}
            </button>
        </div>

        <!-- Formulario de entrada -->
        <div class="input-area">
            <textarea ref="messageInput" v-model="messageText" placeholder="Escribe tu mensaje aquí..."
                @keydown.enter.prevent="sendMessage" :disabled="isTyping" rows="1"></textarea>
            <button @click="sendMessage" :disabled="isTyping || !messageText.trim()">
                <span v-if="!isTyping">Enviar</span>
                <span v-else>...</span>
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

interface Result {
    title: string
    short_desc?: string
    content?: string
    gallery?: string
    price?: number
    sale_price?: number
    review_score?: number
    slug?: string
}

const { initConversation, sendMessage: sendChatMessage, messages, isTyping, suggestions, currentBanner } = useChat()
const { searchResults, searchBookingOptions } = useBooking()
const { getBannerInfo } = useBanner()

const messageText = ref('')
const chatArea = ref<HTMLElement>()
const messageInput = ref<HTMLTextAreaElement>()
const showResults = ref(false)
const results = ref<Result[]>([])
const resultsTitle = ref('')
const bookingUrl = ref<string | null>(null)
const bookingButtonText = ref('Ver disponibilidad')
const context = ref({})
const qSuggestions = ref<string[]>([])

onMounted(async () => {
    await initializeChat()
    autoResizeTextarea()
    await loadBanner('general')
})

const initializeChat = async () => {
    // Verificar si hay una conversación guardada en localStorage
    if (process.client) {
        const savedConversation = localStorage.getItem('samanainn_chat')
        if (savedConversation) {
            try {
                const data = JSON.parse(savedConversation)
                // Los mensajes se manejan a través del composable
                context.value = data.context || {}
            } catch (e) {
                console.error('Error al cargar conversación guardada:', e)
            }
        }
    }

    // Si no hay mensajes, inicializar conversación
    console.log('Mensajes iniciales:', messages.value.length)
    if (messages.value.length === 0) {
        console.log('Conversación inicializada')
        //await initConversation()
        // Sugerir preguntas iniciales
        qSuggestions.value = [
            '¿Qué puedo hacer en Samaná?',
            '¿Dónde puedo alojarme en Samaná?',
            '¿Cuáles son los mejores restaurantes?'
        ]
    }
}

const sendMessage = async () => {
    if (!messageText.value.trim() || isTyping.value) return

    const message = messageText.value
    messageText.value = ''

    // Auto-scroll al final del chat
    await nextTick(() => {
        scrollToBottom()
    })

    // Ajustar tamaño del textarea
    autoResizeTextarea()

    try {
        // Enviar mensaje usando el composable
        const response = await sendChatMessage(message)

        // Procesar respuesta
        processResponse(response)
    } catch (error) {
        console.error('Error al enviar mensaje:', error)
    } finally {
        // Auto-scroll al final del chat
        await nextTick(() => {
            scrollToBottom()
        })

        // Guardar conversación en localStorage
        saveConversation()
    }
}

const processResponse = (response: any) => {
    if (!response) return

    // Procesar elementos de UI
    if (response.ui) {
        processUIElements(response.ui)
    }

    // Procesar resultados
    if (response.results && response.results.length > 0) {
        results.value = response.results
        showResults.value = true
    } else {
        showResults.value = false
        results.value = []
    }
}

const processUIElements = (ui: any) => {
    // Actualizar banner
    if (ui.updateBanner && ui.bannerType) {
        loadBanner(ui.bannerType)
    }

    // Configurar área de resultados
    if (ui.showResults !== undefined) {
        showResults.value = ui.showResults
    }

    if (ui.resultType) {
        setResultsTitle(ui.resultType)
    }

    // Configurar botón de reserva
    if (ui.showBookingButton && ui.bookingButtonURL) {
        bookingUrl.value = ui.bookingButtonURL
        if (ui.bookingButtonText) {
            bookingButtonText.value = ui.bookingButtonText
        }
    } else {
        bookingUrl.value = null
    }
}

const loadBanner = async (type: string) => {
    try {
        const banner = await getBannerInfo(type)
        // El banner se actualiza a través del composable
    } catch (error) {
        console.error('Error al cargar banner:', error)
    }
}

const sendSuggestedQuestion = (question: string) => {
    messageText.value = question
    sendMessage()
}

const selectResult = (result: Result) => {
    // Generar URL de detalles del resultado
    let detailUrl = 'https://samanainn.com/'

    if (result.slug) {
        if (results.value.length > 0 && context.value?.lastSearch) {
            const searchType = (context.value as any).lastSearch.type
            switch (searchType) {
                case 'accommodation':
                    detailUrl += `hotel/${result.slug}`
                    break
                case 'restaurant':
                    detailUrl += `restaurant/${result.slug}`
                    break
                case 'tour':
                    detailUrl += `tour/${result.slug}`
                    break
                default:
                    detailUrl += result.slug
            }
        } else {
            detailUrl += result.slug
        }
    }

    // Navegar a la página de detalles
    navigateTo(detailUrl)
}

const navigateTo = (url: string) => {
    if (url.startsWith('http') || url.startsWith('https')) {
        window.open(url, '_blank')
    } else {
        window.location.href = url
    }
}

const formatTime = (timestamp: string) => {
    if (!timestamp) return ''

    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getFirstImage = (gallery: string) => {
    if (!gallery) return '/assets/images/placeholder.jpg'

    const images = gallery.split(',')
    return images[0] || '/assets/images/placeholder.jpg'
}

const truncateText = (text: string, maxLength: number) => {
    if (!text) return ''
    if (text.length <= maxLength) return text

    return text.substring(0, maxLength) + '...'
}

const formatPrice = (price: number) => {
    if (!price) return ''
    return parseFloat(price.toString()).toFixed(2)
}

const formatStars = (score: number) => {
    if (!score) return ''

    const fullStars = Math.floor(score)
    const hasHalfStar = score % 1 >= 0.5

    let stars = '★'.repeat(fullStars)
    if (hasHalfStar) stars += '½'

    return stars
}

const setResultsTitle = (type: string) => {
    switch (type) {
        case 'accommodation':
            resultsTitle.value = 'Alojamientos'
            break
        case 'restaurant':
            resultsTitle.value = 'Restaurantes'
            break
        case 'tour':
            resultsTitle.value = 'Excursiones y Actividades'
            break
        case 'information':
            resultsTitle.value = 'Información'
            break
        default:
            resultsTitle.value = 'Resultados'
    }
}

const autoResizeTextarea = () => {
    nextTick(() => {
        const textarea = messageInput.value
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = textarea.scrollHeight + 'px'
        }
    })
}

const scrollToBottom = () => {
    const area = chatArea.value
    if (area) {
        area.scrollTop = area.scrollHeight
    }
}

const saveConversation = () => {
    if (process.client) {
        const dataToSave = {
            messages: messages.value,
            context: context.value
        }
        localStorage.setItem('samanainn_chat', JSON.stringify(dataToSave))
    }
}
</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 30vh;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

/* Banner */
.banner {
    display: flex;
    height: 180px;
    background-color: #f0f5ff;
    overflow: hidden;
    position: relative;
}

.banner-content {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 1;
}

.banner-content h2 {
    font-size: 24px;
    margin: 0 0 10px;
    color: #333;
}

.banner-content p {
    font-size: 16px;
    margin: 0 0 20px;
    color: #666;
}

.banner-content button {
    align-self: flex-start;
    padding: 8px 16px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}

.banner-content button:hover {
    background-color: #2980b9;
}

.banner-image {
    flex: 1;
    overflow: hidden;
}

.banner-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Banner types */
.banner-accommodation {
    background-color: #e0f7fa;
}

.banner-gastronomy {
    background-color: #fff8e1;
}

.banner-activities {
    background-color: #e8f5e9;
}

.banner-transport {
    background-color: #ede7f6;
}

.banner-general {
    background-color: #e1f5fe;
}

/* Chat area */
.chat-area {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #f9f9f9;
}

.welcome-message {
    text-align: center;
    padding: 20px;
    background-color: #e1f5fe;
    border-radius: 8px;
    margin-bottom: 20px;
}

.welcome-message h3 {
    margin-top: 0;
    color: #0288d1;
}

.message {
    max-width: 80%;
    margin-bottom: 16px;
    padding: 12px 16px;
    border-radius: 8px;
    position: relative;
    clear: both;
}

.message.user {
    background-color: #dcf8c6;
    float: right;
    border-bottom-right-radius: 0;
}

.message.assistant {
    background-color: #fff;
    float: left;
    border-bottom-left-radius: 0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-content {
    font-size: 16px;
    line-height: 1.4;
    word-wrap: break-word;
}

.message-time {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
    text-align: right;
}

/* Loading animation */
.loading-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
}

.loading-dots span {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 0 3px;
    background-color: #999;
    border-radius: 50%;
    animation: dots 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
    animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes dots {

    0%,
    80%,
    100% {
        transform: scale(0);
    }

    40% {
        transform: scale(1.0);
    }
}

/* Results area */
.results-area {
    padding: 20px;
    background-color: #f5f5f5;
    border-top: 1px solid #eee;
}

.results-area h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
    font-size: 18px;
}

.results-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
}

.result-item {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.result-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.result-image {
    height: 160px;
    overflow: hidden;
}

.result-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.result-content {
    padding: 15px;
}

.result-content h4 {
    margin: 0 0 8px;
    font-size: 16px;
    color: #333;
}

.result-content p {
    margin: 0 0 12px;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
}

.result-excerpt {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.result-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    font-size: 14px;
}

.price {
    font-weight: bold;
    color: #0288d1;
}

.original-price {
    text-decoration: line-through;
    color: #999;
    font-weight: normal;
    margin-left: 5px;
    font-size: 12px;
}

.stars {
    color: #ffc107;
    letter-spacing: -2px;
}

.no-results {
    padding: 20px;
    text-align: center;
    color: #666;
    background-color: #fff;
    border-radius: 8px;
}

.booking-action {
    margin-top: 20px;
    text-align: center;
}

.btn-booking {
    padding: 10px 20px;
    background-color: #e91e63;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-booking:hover {
    background-color: #c2185b;
}

/* Suggested questions */
.suggested-questions {
    padding: 15px 20px;
    background-color: #f0f0f0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    border-top: 1px solid #e0e0e0;
}

.btn-question {
    padding: 8px 16px;
    background-color: #e0e0e0;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    transition: background-color 0.2s;
}

.btn-question:hover {
    background-color: #d0d0d0;
}

/* Input area */
.input-area {
    display: flex;
    padding: 15px;
    background-color: #fff;
    border-top: 1px solid #e0e0e0;
}

.input-area textarea {
    flex: 1;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    resize: none;
    font-size: 16px;
    max-height: 120px;
    min-height: 24px;
    line-height: 24px;
}

.input-area textarea:focus {
    outline: none;
    border-color: #3498db;
}

.input-area button {
    margin-left: 10px;
    padding: 0 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.input-area button:hover {
    background-color: #2980b9;
}

.input-area button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

/* Clearfix for messages */
.chat-area::after {
    content: "";
    display: table;
    clear: both;
}
</style>