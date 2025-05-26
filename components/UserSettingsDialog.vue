<template>
    <PrimeDialog
        :visible="isOpen"
        :header="$t('ACTION_USER_SETTINGS')"
        modal
        class="w-full mx-2 max-w-20rem"
        @update:visible="
            (value: boolean) => {
                if (!value) {
                    $emit('cancel');
                }
            }
        "
    >
        <template v-if="isOpen" #default>
            <!-- User Photo -->
            <FormField :label="$t('LABEL_PHOTO')">
                <ImageUploadBox
                    :width="120"
                    :aspectRatio="1"
                    :imageUrl="avatarUrl"
                    :isLoading="isSaving"
                    :compressorOptions="{
                        width: constants.LIMIT.avatarPhotoWidth,
                        height: constants.LIMIT.avatarPhotoHeight,
                        resize: 'cover',
                    }"
                    @file-compressed="(file) => (compressedPhotoFile = file)"
                    @file-removed="() => (compressedPhotoFile = null)"
                />
            </FormField>

            <!-- User Name -->
            <FormField
                :label="$t('LABEL_DISPLAY_NAME')"
                :errors="vuelidate.displayName.$errors"
                required
            >
                <PrimeInputText
                    v-model="formState.displayName"
                    class="w-full"
                    :minlength="constants.LIMIT.minNameLength"
                    :maxlength="constants.LIMIT.maxNameLength"
                    :invalid="vuelidate.displayName.$error"
                    @keypress.enter="onSubmit"
                />
            </FormField>
        </template>
        <template #footer>
            <PrimeButton
                :label="$t('ACTION_CANCEL')"
                text
                rounded
                severity="secondary"
                :disabled="isSaving"
                @click="
                    () => {
                        $emit('cancel');
                    }
                "
            />
            <PrimeButton
                :label="$t('ACTION_SAVE')"
                rounded
                :loading="isSaving"
                @click="onSubmit"
            />
        </template>
    </PrimeDialog>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import type { UserProfile } from 'firebase/auth';

const props = defineProps<{
    isOpen: boolean;
    user: {
        uid: string;
        displayName: string;
        photoURL: string;
    };
}>();

const emit = defineEmits<{
    complete: [];
    cancel: [];
}>();

const userStore = useUserStore();
const { uploadFile } = useStorage();

const initialFormState = {
    displayName: '',
};
const formState = reactive<{
    displayName: string;
}>({ ...initialFormState });

const formValidators = useFormValidators();
const formRules = {
    displayName: {
        required: formValidators.required,
        minLength: formValidators.minLength(constants.LIMIT.minNameLength),
        maxLength: formValidators.maxLength(constants.LIMIT.maxNameLength),
    },
};
const vuelidate = useVuelidate(formRules, formState, { $autoDirty: true });

const avatarUrl = computed(() => props.user.photoURL || '');
const compressedPhotoFile = ref<Blob | null>(null);
const isSaving = ref(false);

// reset form state when dialog opens
watch(
    () => props.isOpen,
    (newValue) => {
        if (newValue) {
            formState.displayName =
                props.user.displayName || initialFormState.displayName;
            compressedPhotoFile.value = null;
            vuelidate.value.$reset();
        }
    },
);

async function onSubmit() {
    const valid = await vuelidate.value.$validate();
    if (!valid) return;

    isSaving.value = true;

    try {
        const newProfile: Partial<UserProfile> = {};
        let newPhotoURL = '';

        // upload photo if provided
        if (compressedPhotoFile.value) {
            const result = await uploadFile({
                path: `${constants.STORAGE_PATH.USER}/${props.user.uid}/avatar`,
                file: compressedPhotoFile.value,
            });
            newPhotoURL = result ? result.downloadUrl : '';
        }

        // Update display name if changed
        if (formState.displayName !== props.user.displayName) {
            newProfile.displayName = formState.displayName;
        }

        // Update photo URL if changed
        if (compressedPhotoFile.value && props.user.photoURL !== newPhotoURL) {
            newProfile.photoURL = newPhotoURL;
        }

        if (Object.keys(newProfile).length === 0) {
            // No changes to save
            emit('complete');
            return;
        }

        // Update user profile
        await userStore.updateUserProfile(newProfile);

        emit('complete');
    } finally {
        isSaving.value = false;
    }
}
</script>
