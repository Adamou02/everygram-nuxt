import type { Timestamp } from '@firebase/firestore';

declare global {
    type Member = {
        userId: string;
        email: string;
        locale: string;
        displayName: string;
        photoUrl: string;
    };

    type CategoryData = { icon: string; color: string };

    type GearRole = 'owner' | 'co-owner';
    type GearCategory =
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

    type Gear = {
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
    type EditingGear = Partial<Gear>;
    type GearWithQuantity = Gear & { quantity: number };

    type TripRole = 'owner' | 'participant';
    type TripGear = {
        id: string;
        quantity: number;
    };
    type TripGearType = 'gears' | 'wornGears';
    type TripDateMode = 'single' | 'multi';
    type Trip = {
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
        bannerImage?: {
            url: string;
            fileName: string;
        };
    };
    type EditingTrip = Partial<Trip>;

    type TripShare = Omit<Trip, 'gears' | 'wornGears'> & {
        gears: Record<string, GearWithQuantity>;
        wornGears: Record<string, GearWithQuantity>;
        owner: UserInfo;
        baseWeight: number;
        consumablesWeight: number;
        packWeight: number;
        wornWeight: number;
        tripShareCreated?: Timestamp;
    };

    type UserInfo = {
        displayName: string;
        photoURL: string;
    };

    type ConsumableCategory =
        | 'food'
        | 'drinks'
        | 'fuel'
        | 'cosmetics'
        | 'sanitary'
        | 'medical'
        | 'others';
    type Consumable = {
        name: string;
        weight: number; // grams
        category: ConsumableCategory;
    };
    type EditingConsumable = Partial<Consumable>;
    type ConsumableWithIndex = Consumable & { index: number };

    type WeightBarChartSubItem = {
        weight: number;
        label: string;
    };
    type WeightBarChartItem = {
        weight: number;
        label: string;
        color: string;
        addBorder?: boolean;
        subItems?: WeightBarChartSubItem[];
    };

    type GearBrand = 'mont-bell' | 'patagonia' | 'arcteryx';
    type BrandData = { name: string; originalName?: string };

    type EventParamKey =
        | 'sign_in_method'
        | 'locale'
        | 'gear_category'
        | 'consumable_category'
        | 'gear_num'
        | 'trip_num'
        | 'date_mode'
        | 'trip_id';
}
