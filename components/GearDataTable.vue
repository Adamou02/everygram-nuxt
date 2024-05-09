<template>
    <PrimeDataTable
        :value="gears"
        dataKey="id"
        edit-mode="cell"
        @cell-edit-complete="(e) => emit('gear-cell-edit-complete', e)"
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
        <PrimeColumn
            v-if="hasQuantity"
            field="quantity"
            :header="$t('LABEL_QUANTITY')"
            class="text-right w-4rem hover:surface-50 hide-in-mobile"
        >
            <template #body="{ data }"> x {{ data.quantity }} </template>
            <template #editor="{ data, field }">
                <PrimeInputNumber
                    v-model="data[field]"
                    :min="1"
                    class="w-3rem text-right"
                />
            </template>
        </PrimeColumn>

        <!-- mobile -->
        <PrimeColumn
            field="name"
            :header="$t('LABEL_NAME')"
            class="lg:hidden"
        />
        <PrimeColumn class="text-right w-7rem lg:hidden">
            <template #body="{ data }">
                {{ data.weight ? formatWeight(data.weight) : '-' }}
                <template v-if="hasQuantity"> x {{ data.quantity }} </template>
            </template>
        </PrimeColumn>

        <!-- actions -->
        <PrimeColumn :exportable="false" class="w-1rem px-0 lg:pl-2">
            <template #body="{ data }">
                <MoreActionsMenuButton
                    text
                    rounded
                    :items="
                        _filter([
                            actions.includes('edit') && {
                                icon: 'pi pi-pencil',
                                label: $t('ACTION_EDIT'),
                                command: () => {
                                    emit('gear-edit', data);
                                },
                            },
                            actions.includes('remove') && {
                                icon: 'pi pi-times',
                                label: $t('ACTION_REMOVE'),
                                command: () => {
                                    emit('gear-remove', data);
                                },
                            },
                            actions.includes('delete') && {
                                icon: 'pi pi-trash',
                                label: $t('ACTION_DELETE'),
                                command: () => {
                                    emit('gear-delete', data);
                                },
                            },
                        ]) as MenuItem[]
                    "
                />
            </template>
        </PrimeColumn>
    </PrimeDataTable>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';

const props = defineProps<{
    gears?: (Gear & { quantity?: number })[];
    hasQuantity?: boolean;
    actions: ('edit' | 'delete' | 'remove')[];
}>();

const emit = defineEmits<{
    'gear-cell-edit-complete': [
        {
            data: Gear;
            newValue: any;
            field: string;
        },
    ];
    'gear-edit': [gear: Gear];
    'gear-delete': [gear: Gear];
    'gear-remove': [gear: Gear];
}>();

const { formatWeight } = useLangUtils();
</script>
