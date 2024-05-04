export default function () {
    const userGearsStore = useUserGearsStore();
    const { gearMap } = storeToRefs(userGearsStore);

    return {
        getTripWeightTotal: (trip: Trip) =>
            _sum(
                _map(trip.gears, (tripGear, gearId) =>
                    gearMap.value[gearId]
                        ? (gearMap.value[gearId].weight || 0) *
                          tripGear.quantity
                        : 0,
                ),
            ),
    };
}
