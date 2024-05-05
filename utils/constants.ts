const GEAR_CATEGORIES: Record<GearCategory, { icon: string; color: string }> = {
    accessories: {
        icon: 'eyeglasses',
        color: '#A7A4A2',
    },
    backpack: {
        icon: 'backpack',
        color: '#CC4545',
    },
    clothing: {
        icon: 'apparel',
        color: '#B68383',
    },
    cooking: {
        icon: 'skillet',
        color: '#E1BA51',
    },
    electronics: {
        icon: 'devices_other',
        color: '#A47723',
    },
    footwear: {
        icon: 'steps',
        color: '#EFA33D',
    },
    hydration: {
        icon: 'water_drop',
        color: '#C4A34A',
    },
    medical: {
        icon: 'medication',
        color: '#8BB683',
    },
    sanitary: {
        icon: 'soap',
        color: '#6E7A6C',
    },
    shelter: {
        icon: 'camping',
        color: '#2C67BA',
    },
    sleeping: {
        icon: 'airline_seat_flat',
        color: '#304869',
    },
    tools: {
        icon: 'hardware',
        color: '#6E6E6E',
    },
    others: {
        icon: 'more_horiz',
        color: '#9E9E9E',
    },
};

const GEAR_CATEGORY_KEYS: GearCategory[] = [
    'accessories',
    'backpack',
    'clothing',
    'cooking',
    'electronics',
    'footwear',
    'hydration',
    'medical',
    'sanitary',
    'shelter',
    'sleeping',
    'tools',
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
    others: {
        icon: 'more_horiz',
        color: '#9E9E9E',
    },
};

const CONSUMABLE_CATEGORY_KEYS: ConsumableCategory[] = [
    'food',
    'drinks',
    'fuel',
    'others',
];

export default {
    ROLE_OWNER: 'owner',
    GEAR_CATEGORIES,
    GEAR_CATEGORY_KEYS,
    CONSUMABLE_CATEGORIES,
    CONSUMABLE_CATEGORY_KEYS,
};
