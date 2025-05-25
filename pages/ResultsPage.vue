<template>
    <div class="results-page">
        <header class="results-header">
            <h2>Resultados de Búsqueda</h2>
            <p>Explora alojamientos, experiencias y restaurantes en Samaná.</p>
        </header>
        <ResultsDisplay />
    </div>
</template>

<script setup>
</script>

<style scoped>
.results-page {
    max-width: 820px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
}

.results-header {
    text-align: center;
    margin-bottom: 2.2rem;
}

.results-header h2 {
    margin: 0 0 8px 0;
    font-size: 2.1rem;
    color: #2563eb;
    font-weight: 700;
}

.results-header p {
    margin: 0;
    color: #595e6b;
    font-size: 1.08rem;
}
</style>
