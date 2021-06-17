var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        image: '../assets/vmSocks-green-onWhite.jpg',
        inStock: false,
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
            },
            {
                variantId: 2235,
                variantColor: "blue",
                variantImage: '../assets/vmSocks-blue-onWhite.jpg',
            }
        ],
        cart: 0
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
        updateProduct (variantImage) {
            this.image = variantImage;
        }
    }
});