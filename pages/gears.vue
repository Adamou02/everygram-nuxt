<!-- a page to list all gear the user has -->
<template>
    <div>
        <h1>Gears</h1>
        <p>Welcome to the gears page!</p>
        <p v-if="isFetchingGears">Loading...</p>
        <ul v-else>
            <li v-for="gear in gears" :key="gear.id">
                <div>{{ gear.name }}: {{ gear.weight }} grams</div>
                <button @click="onEditGear(gear)">Edit</button>
                <button @click="onArchiveGear(gear)">Archive</button>
                <button @click="onDeleteGear(gear)">Delete</button>
            </li>
        </ul>
        <hr />
        <GearEditor
            v-if="isAddingGear || isEditingGear"
            :gear="editingGear"
            @complete="onCompleteEdit"
            @cancel="onCancelEdit"
        />
        <hr />
        <button @click="navigateTo('/dashboard')">Dashboard</button>
        <template v-if="!isAddingGear && !isEditingGear">
            <button @click="onAddGear">Add Gear</button>
        </template>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["auth-guard"],
    layout: "user-page",
});

const userGearsStore = useUserGearsStore();
const { gears, isFetchingGears } = storeToRefs(userGearsStore);

// for GearEditor
const {
    onAddGear,
    onEditGear,
    onDeleteGear,
    onArchiveGear,
    onCompleteEdit,
    onCancelEdit,
    isAddingGear,
    isEditingGear,
    editingGear,
} = useEditGear();
</script>
