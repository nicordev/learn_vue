const Counter = {
    data() {
        return {
            hello: 'hello world!',
            counter: 0,
            isStarted: false,
        };
    },
    mounted() {
        console.log('ready!');
    },
    methods: {
        stopCount() {
            clearInterval(this.intervalId);
            this.isStarted = false;
        },
        startCount() {
            if (this.isStarted) {
                console.log('Counter already started.');

                return;
            }

            this.intervalId = setInterval(() => {
                this.counter++;
            }, 1000);
            this.isStarted = true;
        },
        play() {
            if (this.isStarted) {
                this.stopCount();
            } else {
                this.startCount();
            }

            this.isStarted != this.isStarted;
        }
    }
};

Vue.createApp(Counter).mount('#app');