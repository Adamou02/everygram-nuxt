export default {
    groupGearsByCategory: <T extends Gear>(
        gears: T[],
    ): Partial<Record<GearCategory, T[]>> =>
        _groupBy(gears, (gear) =>
            constants.GEAR_CATEGORY_KEYS.includes(gear.category)
                ? gear.category
                : 'others',
        ),
    getTripWeightTotal: (trip: Trip, gearMap: Record<string, Gear>): number =>
        _sum(
            _map(trip.gears, (tripGear, gearId) =>
                gearMap[gearId]
                    ? (gearMap[gearId].weight || 0) * tripGear.quantity
                    : 0,
            ),
        ),
    getGearsInTrip: (trip: Trip, gearMap: Record<string, Gear>) => {
        return _filter(_map(trip.gears, (gear) => gearMap[gear.id]));
    },
};
