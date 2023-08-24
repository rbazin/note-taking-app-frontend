<template>
    <div class="container is-two-third column">
        <div id="box" class="box has-text-centered px-6">
            <h2 v-if="!notes_store.noteSelected" class="title is-2">Note</h2>
            <h2 v-else class="title is-2">{{ notes_store.noteSelected.name }}</h2>
            <p v-if="!notes_store.noteSelected">No note selected</p>
            <p v-else class="has-text-left">{{ notes_store.noteSelected.text }}</p>
        </div>
    </div>
</template>

<script setup>
import { noteStore } from '@/stores/noteStore'

const notes_store = noteStore()

</script>

<style scoped></style>