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

const getTripWornGearsWeight = (
    trip: Trip,
    gearMap: Record<string, Gear>,
): number =>
    _sum(
        _map(trip.wornGears, (wornGear, gearId) =>
            gearMap[gearId]
                ? (gearMap[gearId].weight || 0) * wornGear.quantity
                : 0,
        ),
    );

const getTripConsumablessWeight = (trip: Trip): number =>
    _sum(_map(trip.consumables || [], (consumable) => +consumable.weight || 0));

const getTripBaseWeight = (trip: Trip, gearMap: Record<string, Gear>): number =>
    getTripGearsWeight(trip, gearMap) + getTripConsumablessWeight(trip);

const getTripWeightTotal = (
    trip: Trip,
    gearMap: Record<string, Gear>,
): number =>
    getTripGearsWeight(trip, gearMap) +
    getTripWornGearsWeight(trip, gearMap) +
    getTripConsumablessWeight(trip);

const getGearsInTrip = (trip: Trip, gearMap: Record<string, Gear>) => {
    return _filter(_map(trip.gears, (gear) => gearMap[gear.id]));
};

const getWornGearsInTrip = (trip: Trip, gearMap: Record<string, Gear>) => {
    return _filter(_map(trip.wornGears, (gear) => gearMap[gear.id]));
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

const formatTripDate = (trip: Trip | TripShare): string => {
    if (trip.dateMode === 'multi' && trip.startDate && trip.endDate) {
        return `${formatDateString(trip.startDate, '/')} ~ ${formatDateString(trip.endDate, '/')}`;
    } else if (trip.dateMode === 'single' && trip.startDate) {
        return formatDateString(trip.startDate, '/');
    }
    return '';
};

const getTripBannerImageUrl = (
    trip: Trip | TripShare,
    size: ThumbnailSize,
): string => {
    return trip.bannerImage
        ? trip.bannerImage.thumbnails?.[size].url || trip.bannerImage.url
        : constants.DEFAULT_TRIP_BANNER_IMAGE_PATH;
};

const getGearPhotoUrl = (gear: Gear, size: ThumbnailSize): string => {
    return gear.photo
        ? gear.photo.thumbnails?.[size].url || gear.photo.url
        : '';
};

export default {
    groupGearsByCategory,
    groupConsumablesByCategory,
    getTripGearsWeight,
    getTripWornGearsWeight,
    getTripConsumablessWeight,
    getTripBaseWeight,
    getTripWeightTotal,
    getGearsInTrip,
    getWornGearsInTrip,
    formatDateToString,
    formatDateString,
    getDaysBetweenDates,
    formatTripDate,
    getTripBannerImageUrl,
    getGearPhotoUrl,
};
