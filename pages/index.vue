<template>
    <div>
        <h1>Home</h1>
        <p>{{ $t('WELCOME_TO_EVERYGRAM') }}</p>
        <hr />
        <nav>
            <NuxtLink v-if="isLoggedIn" to="/gears">
                {{ $t('PAGE_GEARS') }}
            </NuxtLink>
            <template v-else>
                <NuxtLink to="/login">
                    {{ $t('PAGE_LOGIN') }}
                </NuxtLink>
                |
                <NuxtLink to="/signup">
                    {{ $t('PAGE_SIGN_UP') }}
                </NuxtLink>
            </template>
        </nav>
        <div class="locale-changer">
            <!-- buttons of locales -->
            <button
                v-for="locale in locales"
                :key="`locale-${locale.code}`"
                :disabled="locale.code === currentLocale"
                @click="changeLanguage(locale.code)"
            >
                {{ locale.name }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { setLocale, locale: currentLocale, locales } = useI18n();

const changeLanguage = (localCode: string) => {
    setLocale(localCode);
};
</script>
