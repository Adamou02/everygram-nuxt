import { UAParser } from 'ua-parser-js';

// Singleton state
const isLargeScreen = ref<boolean>(false);
const isTouchDevice = ref<boolean>(false);
const isLikelyServerClient = ref<boolean>(false);
let serverInitialized = false;
let clientInitialized = false;

function checkServerClient(userAgent: string): boolean {
    const botPatterns = [
        /curl/i,
        /wget/i,
        /python-requests/i,
        /axios/i,
        /PostmanRuntime/i,
        /Go-http-client/i,
        /Java/i,
        /node\.js/i,
        /bot/i,
        /spider/i,
        /crawler/i,
    ];
    return botPatterns.some((pattern) => pattern.test(userAgent));
}

function initializeDeviceMeta() {
    if (process.server && !serverInitialized) {
        serverInitialized = true;
        const headers = useRequestHeaders();
        const ua = new UAParser(headers['user-agent']);
        const deviceInfo = ua.getResult();
        isLargeScreen.value = !(
            deviceInfo.device.type === 'mobile' ||
            deviceInfo.device.type === 'tablet'
        );
        isTouchDevice.value =
            deviceInfo.device.type === 'mobile' ||
            deviceInfo.device.type === 'tablet';
        isLikelyServerClient.value = checkServerClient(
            headers['user-agent'] || '',
        );
    }

    if (process.client && !clientInitialized) {
        clientInitialized = true;
        const screenSizeListener = () => {
            isLargeScreen.value =
                window.innerWidth >= constants.BREAK_POINTS.lg;
        };
        screenSizeListener();
        window.addEventListener('resize', screenSizeListener);
        isTouchDevice.value =
            'ontouchstart' in window || navigator.maxTouchPoints > 0;
        isLikelyServerClient.value = checkServerClient(
            navigator.userAgent || '',
        );
    }
}

export default function useDeviceMeta() {
    initializeDeviceMeta();

    return {
        isLikelyServerClient,
        isLargeScreen,
        isTouchDevice,
    };
}
