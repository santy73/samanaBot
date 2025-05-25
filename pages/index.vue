<!-- pages/index.vue -->
<template>
    <div id="app">
        <header class="header">
            <div class="logo">
                <img src="../assets/images/logo.png" alt="SamanaInn Logo" />
            </div>
            <nav class="nav">
                <ul>
                    <li><a href="https://samanainn.com">Inicio</a></li>
                    <li><a href="https://samanainn.com/space">Alojamientos</a></li>
                    <li><a href="https://samanainn.com/restaurant">Restaurantes</a></li>
                    <li><a href="https://samanainn.com/tour">Excursiones</a></li>
                    <li><a href="https://samanainn.com/blog">Blog</a></li>
                </ul>
            </nav>
            <div class="language-switcher">
                <button @click="changeLanguage('es')" :class="{ active: currentLanguage === 'es' }">ES</button>
                <button @click="changeLanguage('en')" :class="{ active: currentLanguage === 'en' }">EN</button>
            </div>


        </header>
        <div class="banner">
            <div class="banner-image">
                <img src="../assets/images/banner1.png" />
            </div>
        </div>

        <main class="main">
            <div class="chat-container">
                <h1>{{ translations.title }}</h1>
                <p class="subtitle">{{ translations.subtitle }}</p>

                <ChatInterface />
            </div>
        </main>

        <footer class="footer">
            <div class="footer-content">
                <div class="footer-logo">
                    <!--    <img src="/assets/images/logo.png" alt="SamanaInn Logo" /> -->
                    <p>{{ translations.footerTagline }}</p>
                </div>

                <div class="footer-links">
                    <h3>{{ translations.quickLinks }}</h3>
                    <ul>
                        <li><a href="https://samanainn.com/about">{{ translations.about }}</a></li>
                        <li><a href="https://samanainn.com/contact">{{ translations.contact }}</a></li>
                        <li><a href="https://samanainn.com/faq">{{ translations.faq }}</a></li>
                        <li><a href="https://samanainn.com/terms">{{ translations.terms }}</a></li>
                        <li><a href="https://samanainn.com/privacy">{{ translations.privacy }}</a></li>
                    </ul>
                </div>

                <div class="footer-social">
                    <h3>{{ translations.followUs }}</h3>
                    <div class="social-icons">
                        <a href="https://facebook.com/samanainn" target="_blank" rel="noopener"><i
                                class="icon-facebook"></i></a>
                        <a href="https://instagram.com/samanainn" target="_blank" rel="noopener"><i
                                class="icon-instagram"></i></a>
                        <a href="https://twitter.com/samanainn" target="_blank" rel="noopener"><i
                                class="icon-twitter"></i></a>
                    </div>
                </div>

                <div class="footer-contact">
                    <h3>{{ translations.contactUs }}</h3>
                    <p><i class="icon-map-marker"></i> Samaná, República Dominicana</p>
                    <p><i class="icon-phone"></i> +1 (809) 123123</p>
                    <p><i class="icon-envelope"></i> hello@samanainn.com</p>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2025 SamanaInn. {{ translations.allRightsReserved }}</p>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
interface Translations {
    title: string
    subtitle: string
    footerTagline: string
    quickLinks: string
    about: string
    contact: string
    faq: string
    terms: string
    privacy: string
    followUs: string
    contactUs: string
    allRightsReserved: string
}

const currentLanguage = ref('es')

const translations = ref<Translations>({
    // Español por defecto
    title: 'Asistente Virtual de SamanaInn',
    subtitle: 'Tu guía personal para descubrir lo mejor de Samaná',
    footerTagline: 'Tu destino para descubrir Samaná',
    quickLinks: 'Enlaces rápidos',
    about: 'Sobre nosotros',
    contact: 'Contacto',
    faq: 'Preguntas frecuentes',
    terms: 'Términos de uso',
    privacy: 'Política de privacidad',
    followUs: 'Síguenos',
    contactUs: 'Contáctanos',
    allRightsReserved: 'Todos los derechos reservados'
})

const translations_en: Translations = {
    // Inglés
    title: 'SamanaInn Virtual Assistant',
    subtitle: 'Your personal guide to discover the best of Samaná',
    footerTagline: 'Your destination to discover Samaná',
    quickLinks: 'Quick Links',
    about: 'About us',
    contact: 'Contact',
    faq: 'FAQ',
    terms: 'Terms of use',
    privacy: 'Privacy policy',
    followUs: 'Follow us',
    contactUs: 'Contact us',
    allRightsReserved: 'All rights reserved'
}

const changeLanguage = (lang: string) => {
    currentLanguage.value = lang

    if (lang === 'en') {
        translations.value = translations_en
    } else {
        // Restaurar traducciones por defecto (español)
        translations.value = {
            title: 'Asistente Virtual de SamanaInn',
            subtitle: 'Tu guía personal para descubrir lo mejor de Samaná',
            footerTagline: 'Tu destino para descubrir Samaná',
            quickLinks: 'Enlaces rápidos',
            about: 'Sobre nosotros',
            contact: 'Contacto',
            faq: 'Preguntas frecuentes',
            terms: 'Términos de uso',
            privacy: 'Política de privacidad',
            followUs: 'Síguenos',
            contactUs: 'Contáctanos',
            allRightsReserved: 'Todos los derechos reservados'
        }
    }

    // Guardar preferencia en localStorage
    if (process.client) {
        localStorage.setItem('samanainn_language', lang)
    }
}

const detectPreferredLanguage = () => {
    if (process.client) {
        // Comprobar si hay una preferencia guardada
        const savedLang = localStorage.getItem('samanainn_language')

        if (savedLang) {
            changeLanguage(savedLang)
            return
        }

        // Detectar idioma del navegador
        const browserLang = navigator.language || (navigator as any).userLanguage

        if (browserLang && browserLang.toLowerCase().includes('en')) {
            changeLanguage('en')
        } else {
            // Por defecto, español
            changeLanguage('es')
        }
    }
}

onMounted(() => {
    // Detectar idioma preferido del navegador o de localStorage
    detectPreferredLanguage()
})

useHead({
    title: 'SamanaInn - Asistente Virtual',
    meta: [
        { name: 'description', content: 'Tu guía personal para descubrir lo mejor de Samaná, República Dominicana' }
    ]
})
</script>
<style scoped>
/* Banner */
.banner {
    display: flex;
    height: 360px;
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
</style>