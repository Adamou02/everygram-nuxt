export default function () {
    const userGearsStore = useUserGearsStore();
    const { formatBrand } = useLangUtils();
    const { visibleGears, isFetchingGears } = storeToRefs(userGearsStore);

    const displayGears = computed(() =>
        isFiltered.value ? filteredGears.value : visibleGears.value,
    );
    const gearsGroupByCategory = computed(() =>
        dataUtils.groupGearsByCategory(displayGears.value),
    );
    const nonEmptyGearCatergories = computed(() =>
        constants.GEAR_CATEGORY_KEYS.filter(
            (category) => gearsGroupByCategory.value[category],
        ),
    );
    const emptyGearCategories = computed(() =>
        isFiltered.value
            ? []
            : constants.GEAR_CATEGORY_KEYS.filter(
                  (category) => !gearsGroupByCategory.value[category],
              ),
    );
    const displayGearCatergories = computed(() =>
        isFiltered.value
            ? nonEmptyGearCatergories.value
            : [...nonEmptyGearCatergories.value, ...emptyGearCategories.value],
    );

    // filter
    const filterValue = ref<string>('');
    const filteredGears = ref<Gear[]>([]);
    const isFiltered = ref<boolean>(false);
    const debouncedUpdateFilteredGears = _debounce(() => {
        const searchText = filterValue.value.toLocaleLowerCase();
        if (!searchText) {
            filteredGears.value = visibleGears.value;
            isFiltered.value = false;
            return;
        }
        // filter by gear name or brand or description
        filteredGears.value = visibleGears.value.filter(
            (gear) =>
                gear.name.toLocaleLowerCase().includes(searchText) ||
                (gear.brand &&
                    formatBrand(gear.brand)
                        .toLocaleLowerCase()
                        .includes(searchText)) ||
                (gear.description &&
                    gear.description.toLocaleLowerCase().includes(searchText)),
        );
        isFiltered.value = true;
    }, 500);

    watch(filterValue, (newFilterValue) => {
        if (!newFilterValue) {
            // reset immediately when clear filter
            filteredGears.value = visibleGears.value;
            isFiltered.value = false;
        }
        debouncedUpdateFilteredGears();
    });

    // anniversary gears
    const UPCOMING_DAYS = 7;
    const getNextGearAnniversaryDate = (acquiredDate: Date): Date => {
        const today = new Date();
        const anniversaryDate = new Date(acquiredDate);
        anniversaryDate.setFullYear(today.getFullYear());

        // If the anniversary date is in the past, set it to next year
        if (anniversaryDate <= today) {
            anniversaryDate.setFullYear(today.getFullYear() + 1);
        }

        return anniversaryDate;
    };

    const anniversaryGearList = computed<GearWithAnniversary[]>(() => {
        const today = new Date();
        const results: GearWithAnniversary[] = [];

        visibleGears.value.forEach((gear) => {
            if (!gear.acquiredDate) {
                return false; // Skip gears without an acquired date
            }

            // find gears that acquired date is the same as today, but acquired date's year is in the past
            const acquiredDate = new Date(gear.acquiredDate);
            const isAnniversary =
                acquiredDate.getDate() === today.getDate() &&
                acquiredDate.getMonth() === today.getMonth() &&
                acquiredDate.getFullYear() < today.getFullYear();
            if (isAnniversary) {
                const age = today.getFullYear() - acquiredDate.getFullYear();
                const anniversaryDate = today;
                const daysUntilAnniversary = 0;
                results.push({
                    ...gear,
                    age,
                    daysUntilAnniversary,
                    anniversaryDate,
                });
            }
        });

        // sort results by age in descending order
        results.sort((a, b) => b.age - a.age);
        return results;
    });

    const upcomingAnniversaryGears = computed<GearWithAnniversary[]>(() => {
        const today = new Date();
        const results: GearWithAnniversary[] = [];
        // Change from anniversaryGearList.value to visibleGears.value
        visibleGears.value.forEach((gear) => {
            if (!gear.acquiredDate) {
                return false; // Skip gears without an acquired date
            }
            const acquiredDate = new Date(gear.acquiredDate);
            const nextAnniversaryDate =
                getNextGearAnniversaryDate(acquiredDate);

            // find gears that have an anniversary date in the coming days
            const maxUpcomingDay = new Date(today);
            maxUpcomingDay.setDate(today.getDate() + UPCOMING_DAYS);
            const isAnniversaryComing =
                nextAnniversaryDate > today &&
                nextAnniversaryDate <= maxUpcomingDay;
            if (isAnniversaryComing) {
                const start = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                );
                const end = new Date(
                    nextAnniversaryDate.getFullYear(),
                    nextAnniversaryDate.getMonth(),
                    nextAnniversaryDate.getDate(),
                );
                const daysUntilAnniversary = Math.round(
                    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
                );
                const age =
                    nextAnniversaryDate.getFullYear() -
                    acquiredDate.getFullYear();
                results.push({
                    ...gear,
                    age,
                    daysUntilAnniversary,
                    anniversaryDate: nextAnniversaryDate,
                });
            }
        });

        // sort results by daysUntilAnniversary in ascending order
        results.sort((a, b) => a.daysUntilAnniversary - b.daysUntilAnniversary);
        return results;
    });

    return {
        visibleGears,
        isFetchingGears,
        filterValue,
        isFiltered,
        displayGears,
        gearsGroupByCategory,
        displayGearCatergories,
        anniversaryGearList,
        upcomingAnniversaryGears,
    };
}
