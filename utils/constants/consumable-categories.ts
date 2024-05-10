const CONSUMABLE_CATEGORIES: Record<ConsumableCategory, CategoryData> = {
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

export { CONSUMABLE_CATEGORIES, CONSUMABLE_CATEGORY_KEYS };
