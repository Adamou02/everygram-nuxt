<template>
    <slot name="header" />
    <div class="grid row-gap-5 lg:flex-row-reverse">
        <!-- side -->
        <div class="col-12 lg:block lg:col-4">
            <slot name="side" />
        </div>
        <!-- main -->
        <div class="col-12 lg:col-8 flex flex-column gap-4">
            <slot name="main" />
        </div>
    </div>
</template>
