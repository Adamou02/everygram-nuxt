type Member = {
    userId: string;
    email: string;
    locale: string;
    displayName: string;
    photoUrl: string;
};

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
};
type EditingGear = Partial<Gear>;
type GearWithQuantity = Gear & { quantity: number };

type TripRole = 'owner' | 'participant';
type TripGear = {
    id: string;
    quantity: number;
};
type TripDateMode = 'single' | 'multi';
type Trip = {
    id: string;
    title: string;
    description: string;
    dateMode: TripDateMode;
    startDate: string;
    endDate: string;
    // created: string; //  timestamp
    consumables: Consumable[];
    role: Record<string, TripRole>;
    gears: Record<string, TripGear>;
};
type EditingTrip = Partial<Trip>;

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

type WeightBarChartItem = {
    weight: number;
    label: string;
    color: string;
};
