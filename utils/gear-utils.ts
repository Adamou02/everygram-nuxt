export default {
    groupGearsByCategory: (gears: Gear[]) =>
        _groupBy(gears, (gear) =>
            CONSTANTS.GEAR_CATEGORIES.includes(gear.category)
                ? gear.category
                : 'others',
        ),
};
