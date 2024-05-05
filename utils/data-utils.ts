const groupGearsByCategory = <T extends Gear>(
    gears: T[],
): Partial<Record<GearCategory, T[]>> =>
    _groupBy(gears, (gear) =>
        constants.GEAR_CATEGORY_KEYS.includes(gear.category)
            ? gear.category
            : 'others',
    );

const groupConsumablesByCategory = <T extends Consumable>(
    consumables: T[],
): Partial<Record<ConsumableCategory, T[]>> =>
    _groupBy(consumables, (consumable) =>
        constants.CONSUMABLE_CATEGORY_KEYS.includes(consumable.category)
            ? consumable.category
            : 'others',
    );

const getTripGearsWeight = (
    trip: Trip,
    gearMap: Record<string, Gear>,
): number =>
    _sum(
        _map(trip.gears, (tripGear, gearId) =>
            gearMap[gearId]
                ? (gearMap[gearId].weight || 0) * tripGear.quantity
                : 0,
        ),
    );

const getTripConsumablessWeight = (trip: Trip): number =>
    _sum(_map(trip.consumables || [], (consumable) => consumable.weight));

const getTripWeightTotal = (
    trip: Trip,
    gearMap: Record<string, Gear>,
): number =>
    (getTripGearsWeight(trip, gearMap) || 0) +
    (getTripConsumablessWeight(trip) || 0);

const getGearsInTrip = (trip: Trip, gearMap: Record<string, Gear>) => {
    return _filter(_map(trip.gears, (gear) => gearMap[gear.id]));
};

export default {
    groupGearsByCategory,
    groupConsumablesByCategory,
    getTripGearsWeight,
    getTripConsumablessWeight,
    getTripWeightTotal,
    getGearsInTrip,
};
