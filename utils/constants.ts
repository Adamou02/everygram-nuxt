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
    CONSUMABLES_WEIGHT: '#ffffff',
};

const EMPTY_GEAR_DATA: Omit<Gear, 'id'> = {
    name: '',
    role: {},
    weight: 0,
    category: 'others',
};

const EMPTY_TRIP_DATA: Omit<Trip, 'id'> = {
    title: '',
    description: '',
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

const LOCALES = ['en', 'zh-tw'];

const LIMIT = {
    minWeight: 0,
    maxWeight: 100000,
    minNameLength: 1,
    maxNameLength: 50,
    imageWidth: 1920,
    imageHeight: 1080,
    importLimit: 200,
};

const TRIP_DATE_MODE: Record<string, TripDateMode> = {
    single: 'single',
    multi: 'multi',
};

const DEFAULT_TRIP_BANNER_IMAGE_PATH = '/image/illustration/illu-mountains.jpg';
const SITE_DOMAIN = 'https://everygram.netlify.app'; // to be updated

export default {
    ROLES,
    COLORS,
    GEAR_CATEGORIES,
    GEAR_CATEGORY_KEYS,
    CONSUMABLE_CATEGORIES,
    CONSUMABLE_CATEGORY_KEYS,
    GEAR_BRANDS,
    GEAR_BRAND_KEYS,
    EMPTY_GEAR_DATA,
    EMPTY_TRIP_DATA,
    WEARABLE_GEAR_CATEGORIES,
    LOCALES,
    LIMIT,
    TRIP_DATE_MODE,
    DEFAULT_TRIP_BANNER_IMAGE_PATH,
    SITE_DOMAIN,
};
