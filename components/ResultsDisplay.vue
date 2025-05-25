<template>
    <div class="results-display">
        <div v-if="options && options.length" class="results-list">
            <div v-for="(option, idx) in options" :key="option.id || idx" class="result-item">
                <div class="result-header">
                    <h3>{{ option.title || option.name }}</h3>
                    <span class="result-type">{{ option.type }}</span>
                </div>
                <p class="result-desc">{{ option.description }}</p>
                <div v-if="option.link || option.detailsLink" class="result-actions">
                    <a :href="option.link || option.detailsLink" target="_blank" class="result-btn">
                        Ver detalles
                    </a>
                </div>
            </div>
        </div>
        <div v-else class="results-empty">
            <p>No hay resultados para mostrar.</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
const { options, fetchOptions } = useBooking()

onMounted(() => {
    fetchOptions('accommodation', {})
})
</script>

<style scoped>
.results-display {
    margin: 0 auto;
    max-width: 760px;
}

.results-list {
    display: grid;
    gap: 2rem;
}

.result-item {
    background: #f6f9fb;
    padding: 1.5em;
    border-radius: 14px;
    box-shadow: 0 1px 7px #0001;
    border-left: 4px solid #2563eb22;
}

.result-header {
    display: flex;
    align-items: center;
    gap: 0.7em;
    margin-bottom: 0.6em;
}

.result-header h3 {
    margin: 0;
    font-size: 1.3em;
    color: #22223b;
}

.result-type {
    background: #2563eb18;
    color: #2563eb;
    border-radius: 7px;
    font-size: 0.9em;
    padding: 0.2em 0.9em;
    font-weight: 600;
}

.result-desc {
    color: #60636a;
    margin: 0.6em 0 0.6em 0;
}

.result-actions {
    margin-top: 1em;
}

.result-btn {
    background: #2563eb;
    color: #fff;
    border-radius: 11px;
    padding: 0.6em 2.1em;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.18s;
    box-shadow: 0 1px 4px #0001;
}

.result-btn:hover {
    background: #27459c;
}

.results-empty {
    color: #6a6a6a;
    text-align: center;
    font-size: 1.1em;
    margin: 2em 0;
}
</style>
