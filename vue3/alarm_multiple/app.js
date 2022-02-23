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

    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}T${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

app.component('alarm-form-component', {
    props: {
        initialAlarm: Object,
    },
    data() {
        return {
            alarm: this.initialAlarm,
        };
    },
    template: `
        <div className="field">
            <label className="label" htmlFor="alarm-label-input">Label</label>
            <div className="control">
                <input className="input" type="text" v-model="alarm.label" name="alarm-label-input" />
            </div>
        </div>
        <div className="field">
            <label className="label" htmlFor="alarm-time-input">Time</label>
            <div className="control">
                <input className="input" v-model="alarm.ringAt" type="datetime-local" name="alarm-time-input">
            </div>
        </div>
    `,
});

app.component('alarm-component', {
    props: {
        initialAlarm: Object,
    },
    data() {
        return {
            alarm: this.initialAlarm,
            millisecondsRemaining: undefined,
            alarmKey: undefined,
            countdownKey: undefined,
            isRinging: false,
            isInEditMode: false,
        };
    },
    mounted() {
        this.setAlarm();
        console.log(this.alarm);
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
            this.alarm.ringAt = getNow();
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
            const ringAt = (new Date(this.alarm.ringAt)).getTime();

            console.log(ringAt - now);

            return ringAt - now;
        },
        setAlarm() {
            if (typeof this.alarm.ringAt === 'undefined') {
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
            if (typeof this.alarm.ringAt === 'undefined' || typeof this.alarmKey === 'undefined') {
                return;
            }

            return this.calculateTimeBeforeRing();
        }
    },
    template: `
        <div className="box">
            <h3 className="title is-4">{{ alarm.label }}</h3>
            <div v-if="alarmKey">{{ timeRemaining }}</div>
            <div className="mt-3">
                <div v-if="isInEditMode">
                    <alarm-form-component v-bind:initialAlarm="alarm"></alarm-form-component>
                    <button className="button is-success m-2" v-on:click="setAlarm">Set alarm on {{ alarm.ringAt }}</button>
                    <button className="button is-danger m-2" v-if="alarmKey" v-on:click="cancelAlarm">Remove</button>
                    <button className="button is-ghost m-2" v-on:click="isInEditMode = !isInEditMode">✖</button>
                </div>
                <div v-else>
                    <button className="button is-info m-2 is-size-4" v-on:click="isInEditMode = !isInEditMode">✎</button>
                </div>
                <button className="button is-warning m-2" v-if="isRinging" v-on:click="stopRing">Mute</button>
            </div>
        </div>
    `,
});

app.component('alarm-manager-component', {
    data() {
        return {
            alarms: [],
            alarmToAdd: {
                id: crypto.randomUUID(),
                label: '',
                ringAt: undefined,
            },
        };
    },
    mounted() {
        this.alarmToAdd.ringAt = getNow();
    },
    methods: {
        addAlarm() {
            let label = this.alarmToAdd.label;

            if (!label) {
                label = 'unknown';
            }

            this.alarms.push({
                id: crypto.randomUUID(),
                label,
                ringAt: this.alarmToAdd.ringAt
            });
        },
        removeAlarm(alarmId) {
            this.alarms = this.alarms.filter((alarm) => alarm.id !== alarmId);
        },
    },
    template: `
        <div className="container">
            <h2 className="mt-3 title is-3">Alarm</h2>

            <alarm-form-component v-bind:initialAlarm="alarmToAdd"></alarm-form-component>

            <button className="mt-3 button is-primary" v-on:click="addAlarm">add alarm</button>

            <div className="mt-3 has-text-grey-light">
                <span className="mr-2" v-if="alarmToAdd.label">{{ alarmToAdd.label }}</span><span>should ring at: {{ alarmToAdd.ringAt }}</span>
            </div>

            <div v-for="alarm in alarms">
                <alarm-component v-bind:initialAlarm="alarm"></alarm-component>
                <button className="button is-danger" v-on:click="removeAlarm(alarm.id)">Remove</button><!-- TODO: use an event and move this button in child component instead -->
            </div>
        </div>
    `,
});

app.mount('#components-demo');