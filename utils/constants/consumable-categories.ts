const CONSUMABLE_CATEGORIES: Record<ConsumableCategory, CategoryData> = {
    food: {
        icon: 'restaurant',
        color: '#A7A4A2',
    },
    drinks: {
        icon: 'water_drop',
        color: '#A7A4A2',
    },
    fuel: {
        icon: 'local_fire_department',
        color: '#A7A4A2',
    },
    cosmetics: {
        icon: 'health_and_beauty',
        color: '#A7A4A2',
    },
    sanitary: {
        icon: 'clean_hands',
        color: '#A7A4A2',
    },
    medical: {
        icon: 'medical_services',
        color: '#A7A4A2',
    },
    others: {
        icon: 'more_horiz',
        color: '#BBBBBB',
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

export { CONSUMABLE_CATEGORIES, CONSUMABLE_CATEGORY_KEYS };
