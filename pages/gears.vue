<!-- a page to list all gear the user has -->
<template>
    <div>
        <h1>Gears</h1>
        <p v-if="isFetchingGears">Loading...</p>

        <!-- list gears by displayCatergories -->
        <ul v-if="displayCatergories.length">
            <li v-for="category in displayCatergories" :key="category">
                <h2>{{ category }}</h2>
                <ul>
                    <li
                        v-for="gear in gearsGroupByCategory[category]"
                        :key="gear.id"
                    >
                        <div>{{ gear.name }}: {{ gear.weight }} grams</div>
                        <button @click="onEditGear(gear)">Edit</button>
                        <button @click="onArchiveGear(gear)">Archive</button>
                        <button @click="onDeleteGear(gear)">Delete</button>
                    </li>
                </ul>
            </li>
        </ul>

        <GearEditor
            v-if="isAddingGear || isEditingGear"
            :gear="editingGear"
            @complete-add="onCompleteAddGear"
            @complete-edit="onCompleteEditGear"
            @cancel="onCancelEditGear"
        />
        <button v-else @click="onAddGear">Add Gear</button>
        <hr />
        <nav>
            <NuxtLink to="/dashboard">Dashboard</NuxtLink>
        </nav>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth-guard'],
    layout: 'user-page',
});

const userGearsStore = useUserGearsStore();
const { gears, isFetchingGears } = storeToRefs(userGearsStore);
const gearsGroupByCategory = computed(() =>
    gearUtils.groupGearsByCategory(gears.value),
);
const displayCatergories = computed(() =>
    CONSTANTS.GEAR_CATEGORIES.filter(
        (category) => gearsGroupByCategory.value[category],
    ),
);

// for GearEditor
const {
    onAddGear,
    onEditGear,
    onCompleteAddGear,
    onCompleteEditGear,
    onCancelEditGear,
    isAddingGear,
    isEditingGear,
    editingGear,
} = useEditGear();

const onDeleteGear = async (gear: Gear) => {
    // TODO: check if the gear has been used in any trips
    try {
        await userGearsStore.deleteGear(gear.id);
    } catch (error) {
        console.error(error);
    }
};

const onArchiveGear = async (gear: Gear) => {
    // TODO
    console.log('archive gear', gear);
};
</script>
