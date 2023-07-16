<template>
    <div class="landing-container pt-6">
        <h1 class="title is-1 has-text-centered">Voice commands note taking app</h1>

        <!-- Notes -->
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

        <!-- Voice recording button -->
        <section class="section is-flex is-flex-direction-horizontal is-justify-content-center is-align-items-center">
            <div class="container has-text-centered">
                <div class="button is-rounded is-primary">
                    <span @click="toggleRecording" class="icon-text is-align-items-center" :class="recordingColor"
                        style="cursor: pointer;">
                        <span class="icon is-size-3" :class="recordingColor">
                            <!-- <i class="fa-solid fa-microphone"></i> -->
                            <font-awesome-icon :icon="'fa-solid fa-microphone'" />
                        </span>
                        <span class="is-size-5">
                            {{ recordingText }}
                        </span>
                    </span>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import ItemComponent from '@/components/ItemComponent.vue'
import { noteStore } from '@/stores/noteStore'
import { RecordRTCPromisesHandler, invokeSaveAsDialog, StereoAudioRecorder } from 'recordrtc';

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
    data() {
        return {
            recording: false,
            recorder: null,
        }
    },
    methods: {
        async toggleRecording() {
            if (this.recording) {
                console.log("Stop recording")
                await this.recorder.stopRecording();
                let blob = await this.recorder.getBlob();
                invokeSaveAsDialog(blob, 'audio.wav');
                this.recorder.destroy();
                this.recorder = null;
            }
            else {
                console.log("Start recording")
                let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.recorder = new RecordRTCPromisesHandler(stream, {
                    type: 'audio',
                    mimeType: 'audio/wav',
                    recorderType: StereoAudioRecorder,
                    desiredSampRate: 16000,
                    numberOfAudioChannels: 1,
                });
                this.recorder.startRecording();
            }
            this.recording = !this.recording
        },
    },
    computed: {
        recordingText() {
            return this.recording ? "Click to stop recording" : "Click to start recording"
        },
        recordingColor() {
            return this.recording ? "has-text-danger" : "has-text-white"
        }
    }
}
</script>

<style scoped>
h1 {
    color: #52b69a;
}
</style>