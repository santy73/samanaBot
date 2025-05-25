// composables/useBanner.ts

interface BannerInfo {
    title: string
    subtitle: string
    imageUrl?: string
    action?: {
        text: string
        url: string
    }
    type?: string
}

export const useBanner = () => {
    const config = useRuntimeConfig()
    const API_URL = config.public.apiUrl || 'http://localhost:3000/api'

    // Get banner info by type
    const getBannerInfo = async (type: string = 'general'): Promise<BannerInfo> => {
        try {
            const { data } = await $fetch(`${API_URL}/banner/info`, {
                query: { type }
            })

            if (data.success && data.banner) {
                return {
                    ...data.banner,
                    type
                }
            }

            // Return default banner if API fails
            return getDefaultBanner(type)
        } catch (error) {
            console.error('Error al cargar banner:', error)
            return getDefaultBanner(type)
        }
    }

    // Get available banners
    const getAvailableBanners = async () => {
        try {
            const { data } = await $fetch(`${API_URL}/banner/list`)
            return data.banners || []
        } catch (error) {
            console.error('Error al cargar banners disponibles:', error)
            return []
        }
    }

    // Get personalized banner
    const getPersonalizedBanner = async (conversationId: string, intent: string) => {
        try {
            const { data } = await $fetch(`${API_URL}/banner/personalized`, {
                query: {
                    conversationId,
                    intent
                }
            })

            return data.banner
        } catch (error) {
            console.error('Error al cargar banner personalizado:', error)
            return null
        }
    }

    // Get default banner based on type
    const getDefaultBanner = (type: string): BannerInfo => {
        const defaultBanners: Record<string, BannerInfo> = {
            general: {
                title: "Descubre Samaná",
                subtitle: "Un paraíso en República Dominicana",
                imageUrl: "/banner1.png",
                action: {
                    text: "Explorar",
                    url: "/explore"
                }
            },
            accommodation: {
                title: "Encuentra tu alojamiento perfecto",
                subtitle: "Hoteles, villas y apartamentos en Samaná",
                imageUrl: "/banner-accommodation.png",
                action: {
                    text: "Ver alojamientos",
                    url: "/hotels"
                }
            },
            restaurant: {
                title: "Sabores de Samaná",
                subtitle: "Descubre la gastronomía local",
                imageUrl: "/banner-restaurant.png",
                action: {
                    text: "Ver restaurantes",
                    url: "/restaurants"
                }
            },
            tour: {
                title: "Aventuras inolvidables",
                subtitle: "Excursiones y actividades en Samaná",
                imageUrl: "/banner-tours.png",
                action: {
                    text: "Ver tours",
                    url: "/tours"
                }
            },
            transport: {
                title: "Movilízate con facilidad",
                subtitle: "Opciones de transporte en Samaná",
                imageUrl: "/banner-transport.png",
                action: {
                    text: "Ver opciones",
                    url: "/transport"
                }
            }
        }

        return defaultBanners[type] || defaultBanners.general
    }

    return {
        getBannerInfo,
        getAvailableBanners,
        getPersonalizedBanner,
        getDefaultBanner
    }
}