<!-- a page to list all gear the user has -->
<template>
    <div>
        <h1>Gears</h1>
        <p v-if="isFetchingGears">Loading...</p>
        <ul v-else>
            <li v-for="gear in gears" :key="gear.id">
                <div>{{ gear.name }}: {{ gear.weight }} grams</div>
                <button @click="onEditGear(gear)">Edit</button>
                <button @click="onArchiveGear(gear)">Archive</button>
                <button @click="onDeleteGear(gear)">Delete</button>
            </li>
        </ul>
        <GearEditor
            v-if="isAddingGear || isEditingGear"
            :gear="editingGear"
            @complete="onCompleteEditGear"
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

// for GearEditor
const {
    onAddGear,
    onEditGear,
    onDeleteGear,
    onArchiveGear,
    onCompleteEditGear,
    onCancelEditGear,
    isAddingGear,
    isEditingGear,
    editingGear,
} = useEditGear();
</script>
