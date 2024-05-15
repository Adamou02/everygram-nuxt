const GEAR_CATEGORIES: Record<GearCategory, CategoryData> = {
    accessories: {
        icon: 'atr',
        color: '#999999',
    },
    packs: {
        icon: 'backpack',
        color: '#304869',
    },
    clothing: {
        icon: 'apparel',
        color: '#EFA33D',
    },
    cooking: {
        icon: 'skillet',
        color: '#CC4545',
    },
    electronics: {
        icon: 'devices_other',
        color: '#E1BA51',
    },
    photography: {
        icon: 'photo_camera',
        color: '#8BB683',
    },
    hydration: {
        icon: 'water_bottle',
        color: '#2C67BA',
    },
    shelter: {
        icon: 'camping',
        color: '#9D8B73',
    },
    sleeping: {
        icon: 'airline_seat_flat',
        color: '#B68383',
    },
    tools: {
        icon: 'hardware',
        color: '#6E7A6C',
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
