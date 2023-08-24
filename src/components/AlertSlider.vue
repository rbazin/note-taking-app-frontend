<template>
    <transition name="slide-in-out">
        <div v-if="props.isAlertActivated"
            :class="{ 'is-primary': props.type === 'info', 'is-danger': props.type === 'error' }"
            class="notification toggle-alert">
            <button @click="emit(event)" class="delete"></button>
            {{ text }}
        </div>
    </transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    isAlertActivated: {
        type: Boolean,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['alertEvent', 'errorEvent'])

const text = ref('')
const event = ref('')
if (props.type === 'info') {
    event.value = 'alertEvent'
    text.value = "Request sent ! Wait for the answer to be processed."
} else if (props.type === 'error') {
    event.value = 'errorEvent'
    text.value = "An error occured. Please try again or reload the page."
}
</script>

<style scoped>
.toggle-alert {
    position: absolute;
    left: 50%;
    top: 2rem;
    transform: translateX(-50%);
    z-index: 100;
}

.slide-in-out-enter-from {
    transform: translateY(-100px) translateX(-50%);
}

.slide-in-out-enter-to {
    transform: translateY(0) translateX(-50%);
}

.slide-in-out-enter-active {
    transition: all 0.5s ease;
}

.slide-in-out-leave-from {
    transform: translateY(0) translateX(-50%);
}

.slide-in-out-leave-to {
    transform: translateY(-100px) translateX(-50%);
}

.slide-in-out-leave-active {
    transition: all 0.5s ease;
}</style>