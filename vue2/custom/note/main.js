Vue.component('notepad', {
    template: `
        <div class="notepad">
            <ul>
                <li v-for="note in notes">
                    <p>{{ note.title }}</p>
                </li>
            </ul>

            <form class="note-form" @submit.prevent="onSubmit">
                <input type="text" id="note-title" v-model="title">
                <button type="submit">Submit</button>
            </form>
        </div>
    `,
    data() {
        return {
            notes: [],
            title: null
        };
    },
    methods: {
        onSubmit() {
            let note = {
                title: this.title
            };
            this.notes.push(note);
            this.title = null;
        }
    }
});

var app = new Vue({
    el: '#note-app'
});