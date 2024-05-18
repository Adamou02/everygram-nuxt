import { getAnalytics, logEvent } from 'firebase/analytics';

// firebase analytics logEvent
const log = (name: string, params?: Partial<Record<EventParamKey, any>>) => {
    const analytics = getAnalytics();
    logEvent(analytics, name, params);
};

export default {
    log,
};
