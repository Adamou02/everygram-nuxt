export default function () {
    const { signInWithGoogle, isSigningIn } = useSignInActions();
    const onSignInWithGoogle = async () => {
        analyticsUtils.log(constants.ANALYTICS_EVENTS.CLICK_SIGN_IN_BUTTON, {
            sign_in_method: 'google',
        });
        await signInWithGoogle();
        navigateTo('/trips');
    };

    return {
        onSignInWithGoogle,
        isSigningIn,
    };
}
