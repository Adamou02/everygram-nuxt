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
    _sum(_map(trip.consumables || [], (consumable) => +consumable.weight || 0));

const getTripWeightTotal = (
    trip: Trip,
    gearMap: Record<string, Gear>,
): number =>
    (getTripGearsWeight(trip, gearMap) || 0) +
    (getTripConsumablessWeight(trip) || 0);

const getGearsInTrip = (trip: Trip, gearMap: Record<string, Gear>) => {
    return _filter(_map(trip.gears, (gear) => gearMap[gear.id]));
};

const formatDateToString = (date: Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

const formatDateString = (date: string, separator: string): string => {
    return date.split('-').join(separator);
};

const getDaysBetweenDates = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export default {
    groupGearsByCategory,
    groupConsumablesByCategory,
    getTripGearsWeight,
    getTripConsumablessWeight,
    getTripWeightTotal,
    getGearsInTrip,
    formatDateToString,
    formatDateString,
    getDaysBetweenDates,
};
