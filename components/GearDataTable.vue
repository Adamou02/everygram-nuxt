<template>
    <PrimeDataTable
        :value="sortedGears"
        dataKey="id"
        :edit-mode="props.readonly ? undefined : 'cell'"
        @cell-edit-complete="(e: any) => emit('gear-cell-edit-complete', e)"
        class="p-datatable-hide-thead p-datatable-left-no-padding"
    >
        <!-- desktop -->
        <PrimeColumn field="photo" :header="$t('LABEL_PHOTO')" class="w-3rem">
            <template #body="{ data }">
                <GearPhoto
                    class="w-3rem h-3rem lg:w-4rem lg:h-4rem"
                    :gear="data"
                    :readonly="props.readonly"
                />
            </template>
        </PrimeColumn>
        <PrimeColumn
            field="name"
            :header="$t('LABEL_NAME')"
            :class="['hide-in-mobile', { 'hover:surface-50': !props.readonly }]"
        >
            <template #body="{ data }">
                <div class="flex flex-column gap-1">
                    <div v-if="data.brand" class="text-sm text-color-light">
                        {{ formatBrand(data.brand) }}
                    </div>
                    <div>
                        {{ data.name }}
                    </div>
                </div>
            </template>
            <template #editor="{ data, field }">
                <PrimeInputText
                    v-model="data[field]"
                    :minlength="constants.LIMIT.minNameLength"
                    :maxlength="constants.LIMIT.maxNameLength"
                    class="w-full"
                />
            </template>
        </PrimeColumn>
        <PrimeColumn
            field="weight"
            :header="$t('LABEL_WEIGHT')"
            :class="[
                'text-right white-space-nowrap w-8rem hide-in-mobile',
                { 'hover:surface-50': !props.readonly },
            ]"
        >
            <template #body="{ data }">
                {{ data.weight ? formatWeight(data.weight) : '-' }}
            </template>
            <template #editor="{ data, field }">
                <PrimeInputGroup class="w-7rem">
                    <PrimeInputNumber
                        v-model="data[field]"
                        integer
                        :min="constants.LIMIT.minWeight"
                        :max="constants.LIMIT.maxWeight"
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
            :class="[
                'text-right w-4rem hide-in-mobile',
                { 'hover:surface-50': !props.readonly },
            ]"
        >
            <template #body="{ data }"> x {{ data.quantity }} </template>
            <template #editor="{ data, field }">
                <PrimeInputNumber
                    v-model="data[field]"
                    :min="constants.LIMIT.minQuantity"
                    :max="constants.LIMIT.maxQuantity"
                    class="w-3rem text-right"
                />
            </template>
        </PrimeColumn>

        <!-- mobile -->
        <PrimeColumn
            field="name"
            :header="$t('LABEL_NAME')"
            class="text-sm lg:hidden"
        >
            <template #body="{ data }">
                <div class="flex flex-column gap-1">
                    <div v-if="data.brand" class="text-xs text-color-light">
                        {{ formatBrand(data.brand) }}
                    </div>
                    <div class="line-clamp-2">
                        {{ data.name }}
                    </div>
                </div>
            </template>
        </PrimeColumn>
        <PrimeColumn class="text-right white-space-nowrap text-sm lg:hidden">
            <template #body="{ data }">
                {{ data.weight ? formatWeight(data.weight) : '-' }}
                <template v-if="hasQuantity && data.quantity > 1">
                    x {{ data.quantity }}
                </template>
            </template>
        </PrimeColumn>

        <!-- actions -->
        <PrimeColumn
            v-if="!props.readonly && actions"
            :exportable="false"
            class="w-1rem px-0 lg:pl-2"
        >
            <template #body="{ data }">
                <MoreActionsMenuButton
                    text
                    size="small"
                    :items="
                        _filter([
                            actions.includes('edit') && {
                                icon: 'pi pi-pencil',
                                label: $t('ACTION_EDIT'),
                                command: () => {
                                    emit('gear-edit', data);
                                },
                            },
                            actions.includes('edit-qty') &&
                                hasQuantity && {
                                    icon: 'pi pi-sort',
                                    label: $t('ACTION_EDIT_QUANTITY'),
                                    command: () => {
                                        emit('gear-edit-quantity', data);
                                    },
                                },
                            actions.includes('remove') && {
                                icon: 'pi pi-times',
                                label: $t('ACTION_REMOVE_FROM_TRIP'),
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
    actions?: ('edit' | 'edit-qty' | 'delete' | 'remove')[];
    readonly?: boolean;
}>();

const sortedGears = computed(() => {
    return (
        props.gears?.sort(
            (a, b) =>
                b.weight - a.weight ||
                (b.name < a.name ? 1 : -1) ||
                (b.id < a.id ? 1 : -1),
        ) ?? []
    );
});

const emit = defineEmits<{
    'gear-cell-edit-complete': [
        {
            data: Gear;
            newValue: any;
            field: string;
        },
    ];
    'gear-edit': [gear: Gear];
    'gear-edit-quantity': [gear: GearWithQuantity];
    'gear-delete': [gear: Gear];
    'gear-remove': [gear: Gear];
}>();

const { formatWeight, formatBrand } = useLangUtils();
</script>
