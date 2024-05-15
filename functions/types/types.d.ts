import type { Timestamp } from '@firebase/firestore';

export type Member = {
    userId: string;
    email: string;
    locale: string;
    displayName: string;
    photoUrl: string;
};

export type CategoryData = { icon: string; color: string };

export type GearRole = 'owner' | 'co-owner';
export type GearCategory =
    | 'accessories'
    | 'packs'
    | 'clothing'
    | 'cooking'
    | 'electronics'
    | 'photography'
    | 'hydration'
    | 'shelter'
    | 'sleeping'
    | 'tools'
    | 'others';

export type Gear = {
    id: string;
    name: string;
    role: Record<string, GearRole>;
    weight: number; // grams
    brand?: string;
    category: GearCategory;
    isArchived?: boolean;
    archiveReason?:
        | 'sold'
        | 'donated'
        | 'trashed'
        | 'lost'
        | 'broken'
        | 'other';
    created?: Timestamp;
    updated?: Timestamp;
};
export type EditingGear = Partial<Gear>;
export type GearWithQuantity = Gear & { quantity: number };

export type TripRole = 'owner' | 'participant';
export type TripGear = {
    id: string;
    quantity: number;
};
export type TripGearType = 'gears' | 'wornGears';
export type TripDateMode = 'single' | 'multi';
export type Trip = {
    id: string;
    title: string;
    description: string;
    dateMode?: TripDateMode;
    startDate?: string;
    endDate?: string;
    created?: Timestamp;
    updated?: Timestamp;
    published?: Timestamp;
    role: Record<string, TripRole>;
    gears: Record<string, TripGear>;
    wornGears: Record<string, TripGear>;
    consumables: Consumable[];
    isPublished?: boolean;
};
export type EditingTrip = Partial<Trip>;

export type TripShare = Omit<Trip, 'gears' | 'wornGears'> & {
    gears: Record<string, GearWithQuantity>;
    wornGears: Record<string, GearWithQuantity>;
    owner: UserInfo;
};

export type UserInfo = {
    displayName: string;
    photoURL: string;
};

export type ConsumableCategory =
    | 'food'
    | 'drinks'
    | 'fuel'
    | 'cosmetics'
    | 'sanitary'
    | 'medical'
    | 'others';
export type Consumable = {
    name: string;
    weight: number; // grams
    category: ConsumableCategory;
};
export type EditingConsumable = Partial<Consumable>;
export type ConsumableWithIndex = Consumable & { index: number };

export type WeightBarChartItem = {
    weight: number;
    label: string;
    color: string;
};

export type GearBrand = 'mont-bell' | 'patagonia' | 'arcteryx';
export type BrandData = { name: string; originalName?: string };
