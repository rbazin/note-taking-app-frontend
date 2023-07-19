<template>
    <div class="landing-container pt-6">
        <h1 class="title is-1 has-text-centered">Voice commands note taking app</h1>

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
            <p v-if="timer" class="container is-size-5 has-text-left" style="color: aliceblue;">{{ formatElapsedTime }}</p>
        </section>
        <!-- TODO : add an alert when the answer is note tree is updated -->
        <!-- TODO : disable button while previous request is being processed -->
        <div class="modal" :class="{ 'is-active is-clipped': isModalActivated }">
            <div class="modal-background"></div>
            <div class="modal-content">
                <p>Please wait for the processing to finish before recording something else</p>
            </div>
            <button @click="isModalActivated = !isModalActivated" class="modal-close is-large" aria-label="close"></button>
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
            answer_received: false,
            isModalActivated: false,
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
            this.time += 0.1; // 100 ms
            if (this.timer) {
                setTimeout(() => {
                    this.elapsedTime();
                }, 100)
            }
        },
        async toggleRecording() {
            if (this.recording) {
                console.log("Stop recording")
                await this.recorder.stopRecording();
                let audio_b64 = await this.recorder.getDataURL();

                this.answer_received = false;
                this.toggleTimer();
                try {
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
                    console.log(response);
                    this.notes_store.allNotes = response.data.new_notes;

                } catch (error) {
                    console.log(error);
                }
                this.toggleTimer();
                this.answer_received = true;

                // Delete recorder
                if (this.recorder) {
                    this.recorder.destroy();
                    this.recorder = null;
                }
            }
            else {
                if (!this.answer_received && this.timer && !this.isModalActivated) {
                    this.isModalActivated = true;
                    return;
                } else {
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

            }
            this.recording = !this.recording;
        },
    },
    computed: {
        recordingText() {
            return this.recording ? "Click to stop recording" : "Click to start recording"
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
h1 {
    color: #52b69a;
}
</style>