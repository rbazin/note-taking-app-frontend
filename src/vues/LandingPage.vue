<template>
    <div class="landing-container pt-6">
        <h1 class="title is-1 has-text-centered has-text-primary">Voice commands note taking app</h1>
        <p class="has-text-centered has-text-white">The requests usually take 30s to be processed</p>

        <!-- Notes -->
        <section class="section columns">
            <!-- List of notes -->
            <div class="container column is-one-third is-flex is-flex-direction-horizontal is-justify-content-center">
                <div id="box" class="box has-text-centered px-6">
                    <h2 class="title is-2">Notes</h2>
                    <p>Here are all your notes:</p>
                    <div class="is-flex is-flex-direction-horizontal is-justify-content-center">
                        <item-component class="pt-2" :folder="notes_store.allNotes" />
                    </div>
                </div>
            </div>
            <!-- Note selected -->
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
            <div class="container pr-3" :class="{ 'has-text-right': timer, 'has-text-centered': !timer }">
                <div class="button is-rounded is-primary" :class="{'waiting-background' : isWaitingBackend}" :style="recordingPointer">
                    <span @click="toggleRecording" class="icon-text is-align-items-center" :class="recordingColor" :style="recordingPointer">
                        <span class="icon is-size-3" :class="recordingColor" :style="recordingPointer">
                            <!-- <i class="fa-solid fa-microphone"></i> -->
                            <font-awesome-icon :icon="'fa-solid fa-microphone'" />
                        </span>
                        <span class="is-size-5" :style="recordingPointer">
                            {{ recordingText }}
                        </span>
                    </span>
                </div>
            </div>
            <p v-if="timer" class="container is-size-5 has-text-left" style="color: aliceblue;">{{ formatElapsedTime }}</p>
        </section>

        <div v-if="isAlertActivated" class="notification is-primary toggle-alert">
            <button @click="isAlertActivated = false" class="delete"></button>
            Request sent ! Wait for the answer to be processed.
        </div>
    </div>
</template>

<script>
import ItemComponent from '@/components/ItemComponent.vue'
import { noteStore } from '@/stores/noteStore'
import { RecordRTCPromisesHandler, StereoAudioRecorder } from 'recordrtc'

import axios from 'axios'

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
            timer: false,
            time: 0,
            isRequestSent: false,
            answer_received: false,
            isAlertActivated: false,
        }
    },
    methods: {
        toggleTimer() {
            console.log("Timer toggled")
            this.timer = !this.timer;
            if (this.timer) {
                this.elapsedTime();
            } else {
                this.timer = false;
                this.time = 0;
            }
        },
        elapsedTime() {
            this.time += 0.1; // increment by 100 ms
            if (this.timer) {
                setTimeout(() => {
                    this.elapsedTime();
                }, 100)
            }
        },
        async toggleRecording() {
            if (this.isWaitingBackend) {
                return;
            }
            if (this.recording) {
                console.log("Stop recording")
                this.recording = false;
                await this.recorder.stopRecording();
                let audio_b64 = await this.recorder.getDataURL();

                this.toggleTimer();
                try {
                    console.log("Sending request to backend")
                    // NOTE : answer received and isRequestSent seem to be duplicates
                    this.isRequestSent = true;
                    this.answer_received = false;
                    this.isAlertActivated = true;
                    let response = await axios.post(`${process.env.VUE_APP_BACKEND_API_HOST}:${process.env.VUE_APP_BACKEND_API_PORT}/transcribe`,
                        {
                            notes: this.notes_store.allNotes,
                            audio_b64: audio_b64,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    // update notes
                    console.log("Request received");
                    console.log(response);
                    this.notes_store.allNotes = response.data.new_notes;

                } catch (error) {
                    console.log(error);
                }
                this.toggleTimer();
                this.answer_received = true;
                this.isRequestSent = false;

                // Delete recorder
                if (this.recorder) {
                    this.recorder.destroy();
                    this.recorder = null;
                }
            }
            else {
                console.log("Start recording")
                this.recording = true;
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
        },
    },
    computed: {
        isDisabled() {
            if (this.isWaitingBackend) {
                return 1;
            }
            return 0;
        },
        isWaitingBackend() {
            return !this.recording && !this.answer_received && this.isRequestSent;
        },
        waitingBackground() {
            return this.isWaitingBackend ? "opacity: 0.5; background-color: #ccc;" : "";
        },
        recordingPointer() {
            return !this.isWaitingBackend ? "cursor: pointer;" : "cursor: not-allowed;";
        },
        recordingText() {
            if (this.isWaitingBackend) {
                return "Waiting for backend"
            } else if (this.recording) {
                return "Click to stop recording"
            }
            return "Click to start recording"
        },
        recordingColor() {
            return this.recording ? "has-text-danger" : "has-text-white"
        },
        formatElapsedTime() {
            let minutes = Math.floor(this.time / 60);
            let seconds = Math.floor(this.time % 60);
            let milliseconds = Math.floor((this.time % 1) * 100);
            return `${minutes}:${seconds}:${milliseconds}`;
        },
    }
}
</script>

<style scoped>
.waiting-background {
    opacity: 0.5;
    background-color: #ccc;
}
.toggle-alert {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 2em;
    z-index: 100;
}
</style>