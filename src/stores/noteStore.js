import { defineStore } from "pinia";

export const noteStore = defineStore("noteStore", {
    state: () => ({
        noteSelected: null,
        allNotes: {
            id: 0,
            name: 'Notes',
            text: null,
            type: 'folder',
            children: [],
        },
    }),
    actions: {
        addNote() {
            console.log("addNote");
        },
        deleteNote() {
            console.log("deleteNote");
        },
        editNote() {
            console.log("editNote");
        },
        selectNote(note) {
            console.log("selectNote");
            this.noteSelected = note;
        },
        unselectNote() {
            console.log("unselectNote");
            this.noteSelected = null;
        },
        loadAllNotes() {
            console.log("loadAllNotes");
            this.allNotes = {
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
            };
        },
    },
});