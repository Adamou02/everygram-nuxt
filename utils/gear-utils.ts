export default {
    groupGearsByCategory: (gears: Gear[]) =>
        _groupBy(gears, (gear) =>
            constants.GEAR_CATEGORY_KEYS.includes(gear.category)
                ? gear.category
                : 'others',
        ),
};
