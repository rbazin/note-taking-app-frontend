<template>
    <div class="landing-container pt-6">
        <h1 class="title is-1 has-text-centered has-text-primary">Voice commands note taking app</h1>
        <p class="has-text-centered has-text-white">The requests usually take 30s to be processed</p>

        <!-- Notes -->
        <section class="section columns">
            <notes-list />
            <note-selected />
        </section>

        <!-- Voice recording button -->
        <section class="section is-flex is-flex-direction-horizontal is-justify-content-center is-align-items-center">
            <recording-button @recordingEvent="toggleRecording" :recordingPointer="recordingPointer" :timer="timer"
                :recordingText="recordingText" :recordingColor="recordingColor" :isWaitingBackend="isWaitingBackend"
                :formatElapsedTime="formatElapsedTime" />
        </section>

        <!-- Alerts -->

        <!-- Request sent Info -->
        <alert-slider :isAlertActivated="isAlertActivated" :type="'info'" @alertEvent="isAlertActivated = false" />

        <!-- Error Info -->
        <alert-slider :isAlertActivated="isErrorActivated" :type="'error'" @errorEvent="isErrorActivated = false" />
    </div>
</template>

<script>
import NotesList from '@/components/NotesList.vue'
import NoteSelected from '@/components/NoteSelected.vue'
import RecordingButton from '@/components/RecordingButton.vue'
import AlertSlider from '@/components/AlertSlider.vue'
import { noteStore } from '@/stores/noteStore'
import { RecordRTCPromisesHandler, StereoAudioRecorder } from 'recordrtc'

import axios from 'axios'

export default {
    name: 'LandingPage',
    components: {
        NotesList,
        NoteSelected,
        RecordingButton,
        AlertSlider,
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
            isErrorActivated: false,
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
        toggleAlertActivated() {
            this.isAlertActivated = true;
            setTimeout(() => {
                this.isAlertActivated = false;
            }, 5000)

        },
        toggleError() {
            this.isErrorActivated = true;
            setTimeout(() => {
                this.isErrorActivated = false;
            }, 5000)

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

                    this.isRequestSent = true;
                    this.answer_received = false;
                    this.toggleAlertActivated();
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
                    if (!response.data.new_notes) {
                        throw new Error("No new notes received");
                    }
                    this.notes_store.editNotes(response.data.new_notes);

                } catch (error) {
                    console.log(error);
                    this.toggleError();
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

<style scoped></style>