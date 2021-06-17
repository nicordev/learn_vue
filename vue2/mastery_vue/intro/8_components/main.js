Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img :src="image" alt="socks!">
            </div>

            <div class="product-info">
                <h1 :style="shadowStyle">{{ title }}</h1>

                <div v-show="onSale" style="color: darkviolet;font-weight: bold;">{{ sale }}</div>

                <p v-if="inStock">In Stock</p>
                <p v-else
                    :class="'out-of-stock'">Out of Stock</p>
                <p>User is premium: {{ premium }}</p>
                <p>Shipping: {{ shipping }}

                <div v-for="(variant, index) in variants" 
                    :key="variant.variantId"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)">
                </div>

                <div class="cart">
                    <p>Cart({{ cart }})</p>
                </div>

                <div>
                    <button v-on:click="addToCart" 
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }">Add to cart</button>
                </div>
                <div>
                    <button v-show="cart > 0" @click="removeFromCart">Remove from cart</button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            brand: 'Vue Zog Master',
            product: 'Socks',
            selectedVariant: 0,
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
        };
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
        },
        shipping() {
            if (this.premium) {
                return "Free";
            }
            return 2.99;
        }
    }

});

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul :style="detailsStyle">
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `,
    data() {
        return {
            detailsStyle: {
                backgroundColor: 'grey',
                padding: '1rem',
                margin: '1rem'
            }
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        bobPremium: true,
        sarahPremium: false,
        socksDetails: ["80% cotton", "20% polyester", "Gender-neutral"],
    }
});