<template>
    <div class="chat-interface">
        <header class="chat-header">
            <h2>Asistente Samaná Inn</h2>
            <p>Haz tus preguntas, encuentra alojamientos y descubre experiencias.</p>
        </header>
        <ChatBox />
    </div>
</template>

<script setup>
// Nada más necesario. Componente importado automáticamente.
</script>

<style scoped>
.chat-interface {
    padding: 2rem 0 0 0;
    max-width: 600px;
    margin: 0 auto;
}

.chat-header {
    text-align: center;
    margin-bottom: 1rem;
}

.chat-header h2 {
    margin: 0 0 6px 0;
    font-size: 1.3rem;
    font-weight: 700;
    color: #2563eb;
}

.chat-header p {
    margin: 0;
    color: #4b5563;
}
</style>
