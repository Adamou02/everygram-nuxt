<template>
    <div class="signin-page-container flex align-items-stretch">
        <div class="signin-page-container__banner hidden lg:flex w-6">
            <h1 class="text-white text-center text-4xl mb-6">
                Start managing your gears with Everygram
            </h1>
            <img
                src="/image/illustration/signin.png"
                alt=""
                class="max-w-full"
            />
        </div>
        <div class="w-12 lg:w-6">
            <div
                class="flex justify-content-center align-items-center min-h-screen mx-5"
            >
                <div class="w-full max-w-24rem flex flex-column">
                    <div class="flex justify-content-center mb-5">
                        <img
                            src="/image/logo-vertical.svg"
                            alt="Everygram Logo"
                        />
                    </div>
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '~/assets/theme/themes/mytheme/_variables.scss';

.signin-page-container {
    &__banner {
        min-height: 100vh;
        background-image: url('/image/illustration/signin-bg.png');
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0 5rem;
        background-position: bottom;
        background-size: cover;
        background-repeat: no-repeat;
        background-color: $eg-c-primary;
    }
}
</style>
