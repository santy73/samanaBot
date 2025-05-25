<!-- components/DynamicBanner.vue -->
<template>
    <div class="banner-container" :style="bannerStyle">
        <div class="banner-content">
            <h2 class="banner-title">{{ title }}</h2>
            <p class="banner-subtitle">{{ subtitle }}</p>

            <button v-if="action" @click="$emit('action-click', action)" class="banner-action">
                {{ action.text }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
interface BannerAction {
    text: string
    url: string
}

interface Banner {
    title?: string
    subtitle?: string
    imageUrl?: string
    action?: BannerAction
}

interface Props {
    banner?: Banner
}

interface Emits {
    (e: 'action-click', action: BannerAction): void
}

const props = withDefaults(defineProps<Props>(), {
    banner: () => ({
        title: "Descubre Samaná",
        subtitle: "Un paraíso en República Dominicana",
        imageUrl: "/assets/images/banner_general.jpg",
        action: {
            text: "Explorar",
            url: "/explore"
        }
    })
})

const emit = defineEmits<Emits>()

const title = computed(() => {
    return props.banner?.title || "Descubre Samaná"
})

const subtitle = computed(() => {
    return props.banner?.subtitle || "Un paraíso en República Dominicana"
})

const action = computed(() => {
    return props.banner?.action || { text: "Explorar", url: "/explore" }
})

const bannerStyle = computed(() => {
    const imageUrl = props.banner?.imageUrl || "/assets/images/banner_general.jpg"
    return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${imageUrl}')`
    }
})
</script>

<style scoped>
.banner-container {
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.banner-content {
    max-width: 700px;
    padding: 20px;
    z-index: 1;
}

.banner-title {
    font-size: 36px;
    margin-bottom: 10px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

.banner-subtitle {
    font-size: 18px;
    margin-bottom: 20px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.banner-action {
    background-color: #007bff;
    color: white;
    padding: 10px 25px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.banner-action:hover {
    background-color: #0069d9;
}

@media (max-width: 768px) {
    .banner-container {
        height: 250px;
    }

    .banner-title {
        font-size: 28px;
    }

    .banner-subtitle {
        font-size: 16px;
    }
}

@media (max-width: 480px) {
    .banner-container {
        height: 200px;
    }

    .banner-title {
        font-size: 24px;
    }

    .banner-subtitle {
        font-size: 14px;
    }

    .banner-action {
        padding: 8px 20px;
        font-size: 14px;
    }
}
</style>