import {
    GEAR_CATEGORIES,
    GEAR_CATEGORY_KEYS,
} from './constants/gear-categories';
import {
    CONSUMABLE_CATEGORIES,
    CONSUMABLE_CATEGORY_KEYS,
} from './constants/consumable-categories';
import { GEAR_BRANDS, GEAR_BRAND_KEYS } from './constants/gear-brands';

const ROLES = {
    OWNER: 'owner',
};

const COLORS = {
    BASE_WEIGHT: '#444444',
    WORN_WEIGHT: '#888888',
    CONSUMABLES_WEIGHT: '#CCCCCC',
};

const EMPTY_GEAR: Gear = {
    id: '',
    name: '',
    role: {},
    weight: 0,
    category: 'others',
};

const EMPTY_TRIP: Trip = {
    id: '',
    title: '',
    description: '',
    dateMode: 'single',
    startDate: '',
    endDate: '',
    role: {},
    gears: {},
    wornGears: {},
    consumables: [],
};

const WEARABLE_GEAR_CATEGORIES: GearCategory[] = [
    'clothing',
    'accessories',
    'electronics',
];

export default {
    ROLES,
    COLORS,
    GEAR_CATEGORIES,
    GEAR_CATEGORY_KEYS,
    CONSUMABLE_CATEGORIES,
    CONSUMABLE_CATEGORY_KEYS,
    GEAR_BRANDS,
    GEAR_BRAND_KEYS,
    EMPTY_GEAR,
    EMPTY_TRIP,
    WEARABLE_GEAR_CATEGORIES,
};
