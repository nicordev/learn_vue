var app = new Vue({
    el: '#app',
    data: {
        brand: 'Vue Zog Master',
        product: 'Socks',
        selectedVariant: 0,
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        detailsStyle: {
            secondaryColor: 'grey',
            padding: '1rem',
            margin: '1rem'
        },
        shadowStyle: {
            'box-shadow': '5px 5px 5px 0px #656565',
            'border-radius': '5px'
        },
        variants: [
            {
                variantId: 2234,
                variantColor: "green",
                variantImage: '../assets/vmSocks-green-onWhite.jpg',
                variantQuantity: 124
            },
            {
                variantId: 2235,
                variantColor: "blue",
                variantImage: '../assets/vmSocks-blue-onWhite.jpg',
                variantQuantity: 0
            }
        ],
        cart: 0,
        onSale: false
    },
    methods: {
        addToCart() {
            this.cart++;
        },
        removeFromCart() {
            if (this.cart > 0) {
                this.cart--;
            }
        },
        updateProduct (variantIndex) {
            this.selectedVariant = variantIndex;
        }
    },
    // Cached values until one base property is changed.
    computed: {
        title() {
            return `${this.brand} ${this.product}`;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            this.onSale = 'Socks' === this.product && 'Vue Zog Master' === this.brand;
            return '50% discount!';
        }
    }
});