export default function ({ close }: { close: () => void }) {
    const { localeToLabel, setLocale } = useLangUtils();
    const localeMenuItems = computed(() =>
        constants.LOCALES.map((locale) => ({
            label: localeToLabel(locale),
            command: () => {
                setLocale(locale);
                close();
            },
        })),
    );

    return { localeMenuItems };
}
