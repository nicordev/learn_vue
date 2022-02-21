const SemesterCalendar = {
    props: {
        year: Number,
        semesterId: Number,
    },
    computed: {
        imageSrc() {
            return `https://www.calendriergratuit.fr/images/annuel2/calendrier-${this.year}-${this.semesterId}.jpg`
        }
    },
    template: `
<div style="text-align: center;">
    <img v-bind:src="imageSrc" alt="" style="width: 15cm; margin: 0.25cm 0;">
</div>
`
};

const Calendar = {
    data() {
        return {
            year: (new Date()).getFullYear()
        };
    },
    template: `
<div class="not-printable section container">
    <label class="label" for="year-input">Year</label>
    <input class="input" type="text" v-model="year">
</div>
<SemesterCalendar v-for="semester in [0, 1]" v-bind:year="year" v-bind:semesterId="semester"></SemesterCalendar>
`,
    components: {
        SemesterCalendar
    }
};

const app = Vue.createApp(Calendar);

app.mount('#calendar-print-app');

// print
function createStyleElement(css) {
    const styleElement = document.createElement('style');

    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = css;
    } else {
        styleElement.appendChild(document.createTextNode(css));
    }

    return styleElement;
}

function addCss(css, element = document.head) {
    element.appendChild(createStyleElement(css));
}

addCss(`
@media print {
	.not-printable {
		display: none;
		height: 0px;
	}
}
`)