<template>
    <div v-if="banner" class="dynamic-banner">
        <h2 class="banner-title">{{ banner.title }}</h2>
        <p class="banner-message">{{ banner.message }}</p>
        <div v-if="banner.link" class="banner-action">
            <a :href="banner.link" target="_blank" class="banner-btn">{{ banner.linkText || 'Ver más' }}</a>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
const { banner, fetchBanner } = useBanner()

onMounted(() => {
    fetchBanner('general')
})
</script>

<style scoped>
.dynamic-banner {
    background: linear-gradient(90deg, #2563eb 0%, #00b4d8 100%);
    color: #fff;
    padding: 2.3rem 1.2rem;
    border-radius: 18px;
    margin-bottom: 2.2rem;
    box-shadow: 0 3px 14px #0002;
    text-align: center;
}

.banner-title {
    margin: 0 0 0.5em 0;
    font-size: 2rem;
    font-weight: 700;
}

.banner-message {
    font-size: 1.1rem;
    margin-bottom: 1em;
}

.banner-action {
    margin-top: 1em;
}

.banner-btn {
    background: #fff;
    color: #2563eb;
    padding: 0.6em 2em;
    border-radius: 99px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.18s;
    box-shadow: 0 1px 4px #0001;
}

.banner-btn:hover {
    background: #e0e7ff;
}
</style>
