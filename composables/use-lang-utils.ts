export default function () {
    const i18n = useI18n();

    return {
        formatWeight: (weight: number) => {
            return weight < 1000
                ? i18n.t('INFO_WEIGHT_GRAM', { weight }, weight)
                : i18n.t(
                      'INFO_WEIGHT_KILOGRAM',
                      {
                          weight: _round(weight / 1000, 2),
                      },
                      weight,
                  );
        },
        gearCategoryToLabel: (category: GearCategory) => {
            if (!constants.GEAR_CATEGORY_KEYS.includes(category)) {
                return i18n.t('GEAR_CATEGORY_OTHERS');
            }
            return i18n.t(`GEAR_CATEGORY_${category.toUpperCase()}`);
        },
        consumableCategoryToLabel: (category: ConsumableCategory) => {
            if (!constants.CONSUMABLE_CATEGORY_KEYS.includes(category)) {
                return i18n.t('CONSUMABLE_CATEGORY_OTHERS');
            }
            return i18n.t(`CONSUMABLE_CATEGORY_${category.toUpperCase()}`);
        },
    };
}
