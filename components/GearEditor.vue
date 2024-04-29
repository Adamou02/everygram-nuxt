<!-- a form for editing data of type Gear -->
<template>
    <div>
        <hr />
        <h3>{{ isEditing ? 'Edit' : 'Add' }} Gear</h3>
        <div>
            <div>
                <label>Name</label>
                <input
                    type="text"
                    v-model="editingGear.name"
                    placeholder="Name"
                />
            </div>
            <div>
                <label>Brand</label>
                <input
                    type="text"
                    v-model="editingGear.brand"
                    placeholder="Brand"
                />
            </div>
            <div>
                <label>Weight</label>
                <input
                    type="text"
                    v-model="editingGear.weight"
                    placeholder="Weight"
                />
            </div>
            <div>
                <button @click="onSubmit()">Save</button>
                <button @click="$emit('cancel')">Cancel</button>
            </div>
            <p v-if="isSaving">Saving...</p>
        </div>
        <hr />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    gear: Gear | null;
}>();

const emit = defineEmits(['complete', 'cancel']);

const emptyGear: EditingGear = {
    brand: '',
    name: '',
    weight: 0,
};
const isEditing = !!props.gear;
const editingGear = ref<EditingGear>(
    props.gear ? { ...props.gear } : emptyGear,
);
const isSaving = ref<boolean>(false);
const userGearsStore = useUserGearsStore();

const onSubmit = async () => {
    try {
        isSaving.value = true;
        if (isEditing) {
            await userGearsStore.updateGear({
                id: props.gear.id,
                gear: editingGear.value,
            });
        } else {
            await userGearsStore.addGear(editingGear.value);
        }
        emit('complete');
    } catch (error) {
        console.error(error);
        isSaving.value = false;
    }
};
</script>
