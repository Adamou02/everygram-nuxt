<template>
    <PrimeDataTable
        :value="consumables"
        dataKey="id"
        edit-mode="cell"
        @cell-edit-complete="(e) => emit('consumable-cell-edit-complete', e)"
        class="p-datatable-hide-thead"
    >
        <!-- desktop -->
        <PrimeColumn
            field="name"
            :header="$t('LABEL_NAME')"
            class="hover:surface-50 hide-in-mobile"
        >
            <template #editor="{ data, field }">
                <PrimeInputText v-model="data[field]" class="w-full" />
            </template>
        </PrimeColumn>
        <PrimeColumn
            field="weight"
            :header="$t('LABEL_WEIGHT')"
            class="text-right w-8rem hover:surface-50 hide-in-mobile"
        >
            <template #body="{ data }">
                {{ data.weight ? formatWeight(data.weight) : '-' }}
            </template>
            <template #editor="{ data, field }">
                <PrimeInputGroup class="w-7rem">
                    <PrimeInputNumber
                        v-model="data[field]"
                        class="text-right"
                    />
                    <PrimeInputGroupAddon>g</PrimeInputGroupAddon>
                </PrimeInputGroup>
            </template>
        </PrimeColumn>

        <!-- mobile -->
        <PrimeColumn
            field="name"
            :header="$t('LABEL_NAME')"
            class="lg:hidden"
        />
        <PrimeColumn
            field="weight"
            :header="$t('LABEL_WEIGHT')"
            class="w-5rem text-right lg:hidden"
        >
            <template #body="{ data }">
                {{ data.weight ? formatWeight(data.weight) : '-' }}
            </template>
        </PrimeColumn>

        <PrimeColumn :exportable="false" class="w-1rem px-0 lg:pl-2">
            <template #body="{ data }">
                <MoreActionsMenuButton
                    text
                    rounded
                    :items="[
                        {
                            icon: 'pi pi-pencil',
                            label: $t('ACTION_EDIT'),
                            command: () => {
                                emit('consumable-edit', data.index);
                            },
                        },
                        {
                            icon: 'pi pi-times',
                            label: $t('ACTION_DELETE'),
                            command: () => {
                                emit('consumable-delete', data.index);
                            },
                        },
                    ]"
                />
            </template>
        </PrimeColumn>
    </PrimeDataTable>
</template>

<script setup lang="ts">
const props = defineProps<{
    consumables?: ConsumableWithIndex[];
}>();

const emit = defineEmits<{
    'consumable-edit': [index: number];
    'consumable-delete': [index: number];
    'consumable-cell-edit-complete': [
        {
            data: ConsumableWithIndex;
            newValue: any;
            field: string;
        },
    ];
}>();

const { formatWeight } = useLangUtils();
</script>
