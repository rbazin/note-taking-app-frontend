<template>
    <div>
        <div class="is-flex is-flex-direction-horizontal pt-2">
            <font-awesome-icon class="is-size-4" :icon="icon" color="#52b69a" />
            <router-link v-if="folder.type == 'file'" to="/note" class="px-2">{{folder.name}}</router-link>
            <div v-else class="px-2">{{folder.name}}</div>
        </div>
        <div class="pl-5">
            <item-component v-for="child in folder.children" :folder="child" :key="child.id" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ItemComponent',
    data() {
        return {
            icon: this.folder.type === 'folder' ? 'fa-solid fa-folder' : 'fa-solid fa-file-pen'
        }
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