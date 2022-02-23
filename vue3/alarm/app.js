const app = Vue.createApp({});
const audio = new Audio("https://www.freesoundslibrary.com/wp-content/uploads/2018/02/birds-chirping-sound-effect.mp3");

function playBirds() {
    audio.play();
}

function pauseBirds() {
    audio.pause();
}

function convertMilliseconds(milliseconds) {
    let days, hours, minutes, seconds;

    seconds = Math.floor(milliseconds / 1000);
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    days = Math.floor(hours / 24);
    hours = hours % 24;
    hours += days * 24;

    return {
        days,
        hours,
        minutes,
        seconds,
    };
}

function getNow() {
    const now = new Date();

    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}T${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}

app.component('alarm-component', {
    data() {
        return {
            ringAt: undefined,
            millisecondsRemaining: undefined,
            alarmKey: undefined,
            countdownKey: undefined,
            isRinging: false,
        };
    },
    mounted() {
        console.log('ready!');
    },
    computed: {
        timeRemaining() {
            if (typeof this.millisecondsRemaining === 'undefined') {
                this.updateTimeRemaining();
            }

            const time = convertMilliseconds(this.millisecondsRemaining);

            if (time.days) {
                return `${time.days} ${time.hours}:${time.minutes}:${time.seconds}`;
            }

            if (time.hours) {
                return `${time.hours}:${time.minutes}:${time.seconds}`;
            }

            if (time.minutes) {
                return `${time.minutes}:${time.seconds}`;
            }

            return `${time.seconds}`;
        },
    },
    methods: {
        resetRingAt() {
            this.ringAt = getNow();
        },
        cancelAlarm() {
            if (typeof this.alarmKey !== 'undefined') {
                clearTimeout(this.alarmKey);
            }

            this.alarmKey = undefined;
            this.resetRingAt();
            this.millisecondsRemaining = undefined;

            if (typeof this.countdownKey !== 'undefined') {
                clearInterval(this.countdownKey);
            }

            this.countdownKey = undefined;
            console.log('alarm canceled.');
        },
        ring() {
            console.log('ring!');
            playBirds();
            this.isRinging = true;
            this.cancelAlarm();
        },
        stopRing() {
            pauseBirds();
            this.isRinging = false;
        },
        calculateTimeBeforeRing() {
            const now = Date.now();
            const ringAt = (new Date(this.ringAt)).getTime();

            console.log(ringAt - now);

            return ringAt - now;
        },
        setAlarm(event) {
            if (typeof this.ringAt === 'undefined') {
                console.log('missing ringAt');

                return;
            }

            if (typeof this.alarmKey !== 'undefined') {
                this.cancelAlarm();
            }

            const timeBeforeRing = this.calculateTimeBeforeRing();
            this.alarmKey = setTimeout(this.ring, timeBeforeRing);
            this.countdownKey = setInterval(this.updateTimeRemaining, 1000);
        },
        updateTimeRemaining() {
            this.millisecondsRemaining = this.countdown();
        },
        countdown() {
            if (typeof this.ringAt === 'undefined' || typeof this.alarmKey === 'undefined') {
                return;
            }

            return this.calculateTimeBeforeRing();
        }
    },
    template: `
        <div>
            <input v-model="ringAt" type="datetime-local" name="" id="">
        </div>
        <div style="margin-top: 1em;">
            <button v-on:click="setAlarm">set alarm on {{ ringAt }}</button>
        </div>
        <div v-if="alarmKey">{{ timeRemaining }}</div>
        <div style="margin-top: 1em;">
            <button v-if="alarmKey" v-on:click="cancelAlarm">cancel alarm</button>
        </div>
        <div style="margin-top: 1em;">
            <button v-if="isRinging" v-on:click="stopRing">pause ring</button>
        </div>
    `
});

app.mount('#components-demo');