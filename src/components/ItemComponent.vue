<template>
    <div>
        <div class="is-flex is-flex-direction-horizontal pt-2">
            <font-awesome-icon class="is-size-4" :icon="this.folder.type === 'folder' ? 'fa-solid fa-folder' : 'fa-solid fa-file-pen'" color="#52b69a" />
            <a v-if="folder.type == 'file'" class="px-2" @click="notes_store.selectNote(folder)">{{ folder.name }}</a>
            <div v-else class="px-2">{{folder.name}}</div>
        </div>
        <div class="pl-5">
            <item-component v-for="child in folder.children" :folder="child" :key="child.id" />
        </div>
    </div>
</template>

<script>
import { noteStore } from '@/stores/noteStore'

export default {
    name: 'ItemComponent',
    setup() {
        const notes_store = noteStore()
        return { notes_store }
    },
    props: {
        folder: {
            type: Object,
            required: true
        }
    },
}
</script>

<style scoped></style>