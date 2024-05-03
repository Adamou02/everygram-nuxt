export default {
    groupGearsByCategory: (gears: Gear[]) =>
        _groupBy(gears, (gear) =>
            constants.GEAR_CATEGORIES.includes(gear.category)
                ? gear.category
                : 'others',
        ),
};
