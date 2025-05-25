
import bannerService from '~/services/bannerService'

export function useBanner() {
    const banner = ref(null)
    const bannerList = ref([])

    const fetchBanner = async (type = 'general') => {
        const { data } = await bannerService.getBannerInfo(type)
        banner.value = data
    }

    const fetchAvailableBanners = async () => {
        const { data } = await bannerService.getAvailableBanners()
        bannerList.value = data
    }

    const getPersonalizedBanner = async (conversationId, intent) => {
        const { data } = await bannerService.getPersonalizedBanner(conversationId, intent)
        banner.value = data
    }

    return {
        banner,
        bannerList,
        fetchBanner,
        fetchAvailableBanners,
        getPersonalizedBanner
    }
}
