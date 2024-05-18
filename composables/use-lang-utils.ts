export default function () {
    const i18n = useI18n();

    return {
        getCurrentLocale: () => {
            return i18n.locale.value;
        },
        localeToLabel: (locale: string) => {
            return i18n.t(`LABEL_LOCALE_${_snakeCase(locale).toUpperCase()}`);
        },
        setLocale: (locale: string) => {
            i18n.setLocale(locale);
            analyticsUtils.log(constants.ANALYTICS_EVENTS.CHANGE_LOCALE, {
                locale,
            });
        },
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
