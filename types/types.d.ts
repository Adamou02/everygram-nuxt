type GearRole = 'owner' | 'co-owner';
type Gear = {
    id: string;
    brand: string;
    name: string;
    role: Record<string, GearRole>;
    weight: number; // grams
    isArchived: boolean;
    archiveReason: 'sold' | 'donated' | 'trashed' | 'lost' | 'broken' | 'other';
};
type EditingGear = Partial<Gear>;

type TripRole = 'owner' | 'participant';
type TripGear = {
    id: string;
    quantity: number;
};
type Trip = {
    id: string;
    title: string;
    description: string;
    role: Record<string, TripRole>;
    gears: Record<string, TripGear>;
};
type EditingTrip = Partial<Trip>;
