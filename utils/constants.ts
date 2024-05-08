const GEAR_CATEGORIES: Record<GearCategory, { icon: string; color: string }> = {
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

const CONSUMABLE_CATEGORIES: Record<
    ConsumableCategory,
    { icon: string; color: string }
> = {
    food: {
        icon: 'restaurant',
        color: '#FFB74D',
    },
    drinks: {
        icon: 'local_drink',
        color: '#4DB6AC',
    },
    fuel: {
        icon: 'local_fire_department',
        color: '#FF7043',
    },
    cosmetics: {
        icon: 'sanitizer',
        color: '#FF4081',
    },
    sanitary: {
        icon: 'soap',
        color: '#304869',
    },
    medical: {
        icon: 'medication',
        color: '#CC4545',
    },
    others: {
        icon: 'more_horiz',
        color: '#9E9E9E',
    },
};

const CONSUMABLE_CATEGORY_KEYS: ConsumableCategory[] = [
    'food',
    'drinks',
    'fuel',
    'cosmetics',
    'sanitary',
    'medical',
    'others',
];

const COLORS = {
    BASE_WEIGHT: '#666666',
    CONSUMABLES_WEIGHT: '#999999',
};

export default {
    ROLE_OWNER: 'owner',
    GEAR_CATEGORIES,
    GEAR_CATEGORY_KEYS,
    CONSUMABLE_CATEGORIES,
    CONSUMABLE_CATEGORY_KEYS,
    COLORS,
};
