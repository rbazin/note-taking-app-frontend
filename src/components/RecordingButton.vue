<template>
    <div class="container pr-3" :class="{ 'has-text-right': props.timer, 'has-text-centered': !props.timer }">
        <div class="button is-rounded is-primary" :class="{ 'waiting-background': props.isWaitingBackend }"
            :style="props.recordingPointer">
            <span @click="emit('recordingEvent')" class="icon-text is-align-items-center" :class="props.recordingColor"
                :style="props.recordingPointer">
                <span class="icon is-size-3" :class="props.recordingColor" :style="props.recordingPointer">
                    <font-awesome-icon :icon="'fa-solid fa-microphone'" />
                </span>
                <span class="is-size-5" :style="props.recordingPointer">
                    {{ props.recordingText }}
                </span>
            </span>
        </div>
    </div>
    <p v-if="props.timer" class="container is-size-5 has-text-left" style="color: aliceblue;">{{ props.formatElapsedTime }}
    </p>
</template>

<script setup>

const props = defineProps({
    recordingPointer: {
        type: String,
        required: true,
    },
    timer: {
        type: Boolean,
        required: true,
    },
    recordingText: {
        type: String,
        required: true,
    },
    recordingColor: {
        type: String,
        required: true,
    },
    isWaitingBackend: {
        type: Boolean,
        required: true,
    },
    formatElapsedTime: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['recordingEvent'])
</script>

<style scoped>
.waiting-background {
    opacity: 0.5;
    background-color: #ccc;
}
</style>