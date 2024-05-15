const CONSUMABLE_CATEGORIES: Record<ConsumableCategory, CategoryData> = {
    food: {
        icon: 'restaurant',
        color: '#DCB279',
    },
    drinks: {
        icon: 'water_drop',
        color: '#89A2C5',
    },
    fuel: {
        icon: 'local_fire_department',
        color: '#DC755E',
    },
    cosmetics: {
        icon: 'health_and_beauty',
        color: '#E8DD6C',
    },
    sanitary: {
        icon: 'clean_hands',
        color: '#93C589',
    },
    medical: {
        icon: 'medical_services',
        color: '#B68383',
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
