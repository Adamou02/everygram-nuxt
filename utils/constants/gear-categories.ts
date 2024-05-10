const GEAR_CATEGORIES: Record<GearCategory, CategoryData> = {
    accessories: {
        icon: 'atr',
        color: '#999999',
    },
    packs: {
        icon: 'backpack',
        color: '#8BB683',
    },
    clothing: {
        icon: 'apparel',
        color: '#B68383',
    },
    cooking: {
        icon: 'skillet',
        color: '#A47723',
    },
    electronics: {
        icon: 'devices_other',
        color: '#E1BA51',
    },
    photography: {
        icon: 'photo_camera',
        color: '#EFA33D',
    },
    hydration: {
        icon: 'water_drop',
        color: '#2C67BA',
    },
    shelter: {
        icon: 'camping',
        color: '#C4A34A',
    },
    sleeping: {
        icon: 'airline_seat_flat',
        color: '#6E7A6C',
    },
    tools: {
        icon: 'hardware',
        color: '#6E6E6E',
    },
    others: {
        icon: 'more_horiz',
        color: '#A7A4A2',
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

export { GEAR_CATEGORIES, GEAR_CATEGORY_KEYS };
