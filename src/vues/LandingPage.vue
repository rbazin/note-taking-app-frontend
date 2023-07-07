<template>
    <div class="landing-container pt-6">
        <h1 class="title is-1 has-text-centered">Note taking app</h1>
        <section class="section">
            <div class="container is-flex is-flex-direction-horizontal is-justify-content-center">
                <div id="box" class="box has-text-centered px-6">
                    <h2 class="title is-2">Notes</h2>
                    <p>Here are all your notes :</p>
                    <div class="is-flex is-flex-direction-horizontal is-justify-content-center">
                        <item-component class="pt-2" :folder="architecture" />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import ItemComponent from '../components/ItemComponent.vue'

export default {
    name: 'LandingPage',
    components: {
        ItemComponent
    },
    data() {
        return {
            architecture: {
                id: 0,
                name: 'Main',
                text: null,
                type: 'folder',
                children: [
                    {
                        id: 1,
                        name: 'Folder 1',
                        text: null,
                        type: 'folder',
                        children: [
                            {
                                id: 2,
                                name: 'Note 1',
                                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio. Donec sollicitudin. Nulla vitae mauris non felis mollis faucibus.',
                                type: 'file',
                                children: []
                            },
                            {
                                id: 3,
                                name: 'Note 2',
                                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio. Donec sollicitudin. Nulla vitae mauris non felis mollis faucibus.',
                                type: 'file',
                                children: []
                            }
                        ]
                    },
                    {
                        id: 4,
                        name: 'Folder 2',
                        text: null,
                        type: 'folder',
                        children: [
                            {
                                id: 5,
                                name: 'Note 3',
                                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio. Donec sollicitudin. Nulla vitae mauris non felis mollis faucibus.',
                                type: 'file',
                                children: []
                            },
                            {
                                id: 6,
                                name: 'Note 4',
                                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio. Donec sollicitudin. Nulla vitae mauris non felis mollis faucibus.',
                                type: 'file',
                                children: []
                            }
                        ]
                    }
                ],
            }
        }
    },
    methods: {
        
    },
}
</script>

<style scoped>
h1 {
    color: #52b69a;
}
#box {
    width: max-content;
}
</style>