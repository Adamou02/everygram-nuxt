<template>
    <PrimeButton
        type="button"
        severity="secondary"
        rounded
        outlined
        :label="type === 'text' ? $t('ACTION_IMPORT_EXPORT_GEARS') : ''"
        icon="pi pi-file-arrow-up"
        aria-haspopup="true"
        :aria-controls="isLargeScreen ? menuId : undefined"
        @click="(e) => (isLargeScreen ? toggle(e) : (isOpenBottomMenu = true))"
    />
    <PrimeMenu ref="menu" :id="menuId" :model="menuItems" :popup="true" />
    <BottomSheetMenu
        :menuItems="menuItems"
        :isOpen="isOpenBottomMenu"
        @close="isOpenBottomMenu = false"
    />
    <ImportGearsDialog
        :is-open="isOpenImportGearsDialog"
        @close="isOpenImportGearsDialog = false"
    />
</template>

<script lang="ts" setup>
defineProps<{
    type: 'text' | 'icon';
}>();

const isOpenImportGearsDialog = ref<boolean>(false);
const { isLargeScreen } = useDeviceMeta();
const i18n = useI18n();
const router = useRouter();

const userGearsStore = useUserGearsStore();

const exportToCsv = () => {
    const gears = userGearsStore.gears || [];

    const rows = gears.map((g: Gear) => [
        g.name ?? '',
        g.weight ?? '',
        g.category ?? '',
        g.description ?? '',
        g.currency ?? '',
        g.price ?? '',
        g.acquiredDate ?? '',
    ]);

    const header = [
        'name',
        'weight',
        'category',
        'description',
        'currency',
        'price',
        'acquiredDate',
    ];

    const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'gears_export.csv');

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
};

const menuItems = computed(() => {
    return [
        {
            label: i18n.t('ACTION_IMPORT_FROM_LIGHTERPACK'),
            command: () => {
                router.push('/import-gears-from-lighterpack');
            },
        },
        {
            label: i18n.t('ACTION_IMPORT_FROM_CSV_FILE'),
            command: () => {
                isOpenImportGearsDialog.value = true;
            },
        },
        {
            label: i18n.t('ACTION_EXPORT_TO_CSV_FILE'),
            command: () => {
                exportToCsv();
            },
        },
    ];
});

// desktop menu
const menuId = _uniqueId('overlay_menu_');
const menu = ref();
const toggle = (event: any) => {
    menu.value.toggle(event);
};

// mobile menu
const isOpenBottomMenu = ref(false);
</script>
