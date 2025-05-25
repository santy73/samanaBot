
import bookingService from '~/services/bookingService'

export function useBooking() {
    const options = ref([])
    const details = ref(null)

    const fetchOptions = async (type, filters = {}) => {
        const { data } = await bookingService.getBookingOptions(type, filters)
        options.value = data
    }

    const fetchDetails = async (type, id) => {
        const { data } = await bookingService.getItemDetails(type, id)
        details.value = data
    }

    const generateURL = async (params) => {
        const { data } = await bookingService.generateBookingURL(params)
        return data
    }

    const checkAvailability = async (params) => {
        const { data } = await bookingService.checkAvailability(params)
        return data
    }

    return {
        options,
        details,
        fetchOptions,
        fetchDetails,
        generateURL,
        checkAvailability
    }
}
