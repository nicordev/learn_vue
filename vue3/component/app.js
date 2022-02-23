const app = Vue.createApp({});

app.component('button-counter', {
    data() {
        return {
            count: 0
        };
    },
    template: `
        <button v-on:click="count++">I've been clicked {{ count }} time<span v-if="count > 1">s</span>.</button>
    `
});

app.mount('#components-demo');