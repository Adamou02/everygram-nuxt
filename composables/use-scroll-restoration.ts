/**
 * This composable is used to save and restore the scroll position of a page.
 * It uses sessionStorage to store the scroll position when the component is unmounted
 * and restores it when the component is mounted.
 * It is useful for single-page applications where you want to maintain the scroll position
 * when navigating between different pages or components.
 *
 * Experimental feature. Especially useful when view transitions are enabled.
 * E.g. when navigating between trips and trip page.
 */
export function useScrollRestoration(pageId: string) {
    const storageKey = `scroll-position:${pageId}`;

    onMounted(() => {
        const savedScroll = sessionStorage.getItem(storageKey);
        if (savedScroll) {
            // use setTimeout to ensure the scroll restoration happens after the DOM is ready
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedScroll, 10));
            }, 1);
        }
    });

    onBeforeUnmount(() => {
        sessionStorage.setItem(storageKey, window.scrollY.toString());
    });
}
