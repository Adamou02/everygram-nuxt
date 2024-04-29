<template>
    <div>
        <ul>
            <li v-for="gear in gearsForSelect" :key="gear.id">
                <label>
                    <input
                        type="checkbox"
                        :value="gear.id"
                        v-model="newSelectedGearIds"
                    />
                    {{ gear.name }}: {{ gear.weight }} grams
                </label>
                <button
                    @click="quantityMap[gear.id] > 1 && quantityMap[gear.id]--"
                >
                    -
                </button>
                <span>{{ quantityMap[gear.id] || 1 }}</span>
                <button
                    @click="
                        quantityMap[gear.id]
                            ? quantityMap[gear.id]++
                            : (quantityMap[gear.id] = 2)
                    "
                >
                    +
                </button>
            </li>
        </ul>
        <button @click="emit('complete', newSelectedGears)">Add</button>
        <button @click="emit('cancel')">Cancel</button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    selectedGearIds: string[];
}>();
const emit = defineEmits<{
    complete: [selectedGears: TripGear[]];
    cancel: [];
}>();

const userGearsStore = useUserGearsStore();
const { gears } = storeToRefs(userGearsStore);
const gearsForSelect = computed(() =>
    gears.value.filter((gear) => !props.selectedGearIds.includes(gear.id)),
);
const newSelectedGearIds = ref<string[]>([]);
const quantityMap = ref<{ [gearId: string]: number }>({});
const newSelectedGears = computed(() =>
    newSelectedGearIds.value.map((id) => ({
        id,
        quantity: quantityMap.value[id] || 1,
    })),
);
</script>
