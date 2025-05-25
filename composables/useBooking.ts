// composables/useBooking.ts

interface BookingItem {
    id: string
    title: string
    image?: string
    rating?: number
    location?: string
    shortDescription?: string
    price?: number
    detailUrl?: string
}

interface BookingFilters {
    accommodationType?: string
    priceRange?: string
    location?: string
    amenities?: string[]
}

interface BookingState {
    searchResults: BookingItem[]
    currentItem: BookingItem | null
    searchFilters: BookingFilters
    recentSearches: any[]
    generatedUrl: string | null
    loadingResults: boolean
    error: string | null
}

export const useBooking = () => {
    const state = useState<BookingState>('booking', () => ({
        searchResults: [],
        currentItem: null,
        searchFilters: {},
        recentSearches: [],
        generatedUrl: null,
        loadingResults: false,
        error: null
    }))

    const config = useRuntimeConfig()
    const API_URL = config.public.apiUrl || 'http://localhost:3000/api'

    // Search booking options
    const searchBookingOptions = async (type: string, filters: BookingFilters = {}) => {
        state.value.loadingResults = true
        state.value.error = null

        try {
            const { data } = await $fetch(`${API_URL}/booking/options`, {
                query: {
                    type,
                    ...filters
                }
            })

            state.value.searchResults = data.results || []
            state.value.searchFilters = filters

            // Save recent search
            state.value.recentSearches = [{
                type,
                filters,
                timestamp: new Date().toISOString(),
                resultCount: data.results.length
            }, ...state.value.recentSearches.slice(0, 4)]

            return data
        } catch (error: any) {
            state.value.error = error.message || 'Error al buscar opciones'
            state.value.searchResults = []
            throw error
        } finally {
            state.value.loadingResults = false
        }
    }

    // Get item details
    const getItemDetails = async (type: string, id: string) => {
        state.value.error = null

        try {
            const { data } = await $fetch(`${API_URL}/booking/details`, {
                query: { type, id }
            })

            state.value.currentItem = data.item
            return data.item
        } catch (error: any) {
            state.value.error = error.message || 'Error al obtener detalles'
            state.value.currentItem = null
            throw error
        }
    }

    // Generate booking URL
    const generateBookingURL = async (params: any) => {
        state.value.error = null

        try {
            const { data } = await $fetch(`${API_URL}/booking/generate-url`, {
                method: 'POST',
                body: params
            })

            state.value.generatedUrl = data.url
            return data.url
        } catch (error: any) {
            state.value.error = error.message || 'Error al generar URL'
            state.value.generatedUrl = null
            throw error
        }
    }

    // Check availability
    const checkAvailability = async (params: any) => {
        state.value.error = null

        try {
            const { data } = await $fetch(`${API_URL}/booking/check-availability`, {
                method: 'POST',
                body: params
            })

            return data.availability
        } catch (error: any) {
            state.value.error = error.message || 'Error al verificar disponibilidad'
            throw error
        }
    }

    // Clear search results
    const clearSearchResults = () => {
        state.value.searchResults = []
    }

    // Clear current item
    const clearCurrentItem = () => {
        state.value.currentItem = null
    }

    // Computed properties
    const hasSearchResults = computed(() => state.value.searchResults.length > 0)
    const resultCount = computed(() => state.value.searchResults.length)
    const searchResults = computed(() => state.value.searchResults)
    const currentItem = computed(() => state.value.currentItem)
    const currentFilters = computed(() => state.value.searchFilters)
    const recentSearches = computed(() => state.value.recentSearches)
    const generatedUrl = computed(() => state.value.generatedUrl)
    const isLoading = computed(() => state.value.loadingResults)
    const hasError = computed(() => !!state.value.error)
    const errorMessage = computed(() => state.value.error)

    return {
        // State
        searchResults,
        currentItem,
        loadingResults: isLoading,
        error: errorMessage,

        // Actions
        searchBookingOptions,
        getItemDetails,
        generateBookingURL,
        checkAvailability,
        clearSearchResults,
        clearCurrentItem,

        // Getters
        hasSearchResults,
        resultCount,
        currentFilters,
        recentSearches,
        generatedUrl,
        hasError
    }
}