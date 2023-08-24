<template>
    <div class="container column is-one-third is-flex is-flex-direction-horizontal is-justify-content-center">
        <div id="box" class="box has-text-centered px-6">
            <h2 class="title is-2">Notes</h2>
            <p>Here are all your notes:</p>
            <div class="is-flex is-flex-direction-horizontal is-justify-content-center">
                <item-component class="pt-2" :folder="notes_store.allNotes" />
            </div>
        </div>
    </div>
</template>

<script setup>
import ItemComponent from '@/components/ItemComponent.vue'
import { noteStore } from '@/stores/noteStore'

const notes_store = noteStore()
</script>

<style scoped></style>