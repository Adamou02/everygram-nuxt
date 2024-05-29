const GEAR_CATEGORIES: Record<GearCategory, CategoryData> = {
    accessories: {
        icon: 'atr',
        color: '#A795B9',
    },
    packs: {
        icon: 'backpack',
        color: '#7C909B',
    },
    clothing: {
        icon: 'apparel',
        color: '#C78954',
    },
    cooking: {
        icon: 'skillet',
        color: '#B18688',
    },
    electronics: {
        icon: 'devices_other',
        color: '#D2C47C',
    },
    photography: {
        icon: 'photo_camera',
        color: '#739965',
    },
    hydration: {
        icon: 'water_bottle',
        color: '#7CB0C1',
    },
    shelter: {
        icon: 'camping',
        color: '#A48D77',
    },
    sleeping: {
        icon: 'airline_seat_flat',
        color: '#6B77A2',
    },
    tools: {
        icon: 'hardware',
        color: '#848A7A',
    },
    others: {
        icon: 'more_horiz',
        color: '#BDC1C3',
    },
};

const GEAR_CATEGORY_KEYS: GearCategory[] = [
    'packs',
    'clothing',
    'shelter',
    'sleeping',
    'electronics',
    'photography',
    'cooking',
    'hydration',
    'tools',
    'accessories',
    'others',
];

const WEARABLE_GEAR_CATEGORY_KEYS: GearCategory[] = [
    'clothing',
    'accessories',
    'electronics',
    'others',
];

export { GEAR_CATEGORIES, GEAR_CATEGORY_KEYS, WEARABLE_GEAR_CATEGORY_KEYS };
