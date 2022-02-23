const TodoMeta = {
    props: [ 'task' ],
    template: `<p>{{ task.meta }}</p>`
};

const TodoItem = {
    props: [ 'todo' ],
    template: `<li>
        {{ todo.text }}
        <todo-meta v-bind:task="todo"></todo-meta>
    </li>`,
    components: {
        TodoMeta
    }
};

const TodoList = {
    data() {
        return {
            groceryList: [
                {
                    id: 0,
                    text: 'apple',
                    meta: 'red'
                },
                {
                    id: 1,
                    text: 'orange',
                    meta: 'orange'
                },
                {
                    id: 2,
                    text: 'pear',
                    meta: 'yellow'
                }
            ]
        };
    },
    components: {
        TodoItem
    }
};

const app = Vue.createApp(TodoList);

app.mount('#todo-list-app');
