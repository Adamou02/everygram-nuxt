export default function useNavigation() {
    const navigation = useNavigationStore();
    const hasLastVisited = computed(() => !!navigation.previousRoute);
    const previousRoutePath = computed(() => navigation.previousRoute?.path);

    return {
        hasLastVisited,
        previousRoutePath,
    };
}
