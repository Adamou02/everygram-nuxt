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
                <label>Category</label>
                <select v-model="editingGear.category">
                    <option :value="undefined" selected disabled>
                        Select a category
                    </option>
                    <option value="accessories">Accessories</option>
                    <option value="backpack">Backpack</option>
                    <option value="clothing">Clothing</option>
                    <option value="cooking">Cooking</option>
                    <option value="electronics">Electronics</option>
                    <option value="footwear">Footwear</option>
                    <option value="hydration">Hydration</option>
                    <option value="medical">Medical</option>
                    <option value="sanitary">Sanitary</option>
                    <option value="shelter">Shelter</option>
                    <option value="sleeping">Sleeping</option>
                    <option value="tools">Tools</option>
                    <option value="othters">Others</option>
                </select>
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

const emit = defineEmits<{
    'complete-add': [gear: Gear];
    'complete-edit': [gear: Gear];
    cancel: [];
}>();

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
            emit('complete-edit', userGearsStore.getGearById(props.gear.id));
        } else {
            const docId = await userGearsStore.addGear(editingGear.value);
            if (!docId) {
                throw new Error('Failed to add gear');
            }
            emit('complete-add', userGearsStore.getGearById(docId));
        }
    } catch (error) {
        console.error(error);
        isSaving.value = false;
    }
};
</script>
