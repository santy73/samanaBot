<template>
    <div class="home-page">
        <DynamicBanner class="mb-8" />

        <!-- Menú principal de navegación, puedes ajustar según tu diseño -->
        <nav class="main-nav">
            <ul>
                <li><a href="/" class="nav-link" :class="{ active: currentSection === 'home' }"
                        @click.prevent="goSection('home')">Inicio</a></li>
                <li><a href="#resultados" class="nav-link" :class="{ active: currentSection === 'results' }"
                        @click.prevent="goSection('results')">Resultados</a></li>
                <li><a href="#chat" class="nav-link" :class="{ active: currentSection === 'chat' }"
                        @click.prevent="goSection('chat')">Chat</a></li>
            </ul>
        </nav>

        <section v-if="currentSection === 'home'" class="section-home">
            <h1>Bienvenido a Samaná Inn</h1>
            <p class="intro-text">
                Descubre los mejores alojamientos, experiencias y restaurantes de Samaná.
                Usa el buscador o nuestro chat inteligente para empezar tu viaje.
            </p>
        </section>

        <section v-if="currentSection === 'results'" id="resultados" class="section-results">
            <ResultsDisplay />
        </section>

        <section v-if="currentSection === 'chat'" id="chat" class="section-chat">
            <ChatInterface />
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Si usas rutas, puedes integrar useRoute/useRouter de Nuxt, aquí navega por sección interna
const currentSection = ref('home')

function goSection(section) {
    currentSection.value = section
    if (typeof window !== 'undefined') {
        if (section === 'results') {
            window.scrollTo({ top: document.getElementById('resultados')?.offsetTop || 0, behavior: 'smooth' })
        } else if (section === 'chat') {
            window.scrollTo({ top: document.getElementById('chat')?.offsetTop || 0, behavior: 'smooth' })
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }
}
</script>

<style scoped>
.home-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.main-nav {
    margin-bottom: 2rem;
    text-align: center;
}

.main-nav ul {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 0;
    margin: 0;
    list-style: none;
}

.nav-link {
    text-decoration: none;
    color: #2a4365;
    font-weight: 500;
    padding: 0.5em 1.5em;
    border-radius: 99px;
    transition: background 0.2s;
}

.nav-link.active,
.nav-link:hover {
    background: #f7fafc;
    color: #1a365d;
}

.section-home {
    margin-bottom: 3rem;
}

.intro-text {
    font-size: 1.2rem;
    color: #505050;
    margin-top: 1.5rem;
    margin-bottom: 3rem;
}

.section-results,
.section-chat {
    margin-top: 3rem;
}
</style>
