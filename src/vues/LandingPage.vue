<template>
    <div class="landing-container pt-6">
        <h1 class="title is-1 has-text-centered">Voice commands note taking app</h1>
        <section class="section columns">
            <div class="container column is-one-third is-flex is-flex-direction-horizontal is-justify-content-center">
                <div id="box" class="box has-text-centered px-6">
                    <h2 class="title is-2">Notes</h2>
                    <p>Here are all your notes:</p>
                    <div class="is-flex is-flex-direction-horizontal is-justify-content-center">
                        <item-component class="pt-2" :folder="notes_store.allNotes" />
                    </div>
                </div>
            </div>
            <div class="container is-two-third column">
                <div id="box" class="box has-text-centered px-6">
                    <h2 v-if="!notes_store.noteSelected" class="title is-2">Note</h2>
                    <h2 v-else class="title is-2">{{ notes_store.noteSelected.name }}</h2>
                    <p v-if="!notes_store.noteSelected">No note selected</p>
                    <p v-else class="has-text-left">{{ notes_store.noteSelected.text }}</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import ItemComponent from '@/components/ItemComponent.vue'
import { noteStore } from '@/stores/noteStore'

export default {
    name: 'LandingPage',
    components: {
        ItemComponent
    },
    setup() {
        const notes_store = noteStore()
        return { notes_store }
    },
    mounted() {
        this.notes_store.loadAllNotes()
    },
}
</script>

<style scoped>
h1 {
    color: #52b69a;
}
</style>