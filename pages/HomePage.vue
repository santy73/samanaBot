<template>
    <div class="home-page">
        <nav class="main-nav">
            <ul>
                <li><a href="#" class="nav-link active">Inicio</a></li>
                <li><a href="#" class="nav-link">Resultados</a></li>
                <li><a href="#" class="nav-link">Chat</a></li>
            </ul>
        </nav>

        <section class="section-home">
            <h1>Bienvenido a Samaná Inn</h1>
            <p class="intro-text">
                Descubre los mejores alojamientos, experiencias y restaurantes de Samaná.
                Usa el buscador o nuestro chat inteligente para empezar tu viaje.
            </p>
        </section>

        <section class="section-chat">
            <ChatBox />
        </section>
    </div>
</template>

<script setup>
// Nada, todo automático
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

.section-chat {
    margin-top: 3rem;
}
</style>
