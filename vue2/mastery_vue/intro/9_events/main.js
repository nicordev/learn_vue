Vue.component('product', {
    props: {
        variants: {
            type: Array,
            required: true
        },
        productDetails: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image" alt="socks!">
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>

                <p v-if="inStock">In Stock</p>
                <p v-else
                    v-bind:class="'out-of-stock'">Out of Stock</p>

                <div v-for="(variant, index) in variants" 
                    v-bind:key="variant.variantId"
                    class="color-box"
                    v-bind:style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)">
                </div>

                <ul>
                    <li v-for="detail in productDetails">{{ detail }}</li>
                </ul>

                <div>
                    <button v-on:click="addToCart" 
                    v-bind:disabled="!inStock"
                        v-bind:class="{ disabledButton: !inStock }">Add to cart</button>
                </div>
                <div>
                    <button v-bind:class="{ disabledButton: !isSelectedVariantInCart() }" @click="removeFromCart">Remove from cart</button>
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
            onSale: false
        };
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', { variant: this.getSelectedVariant(), add: true });
        },
        removeFromCart() {
            this.$emit('remove-from-cart', { variant: this.getSelectedVariant(), add: false });
        },
        updateProduct (variantIndex) {
            this.selectedVariant = variantIndex;
        },
        getSelectedVariant() {
            return this.variants[this.selectedVariant];
        },
        isSelectedVariantInCart() {
            return this.getSelectedVariant().variantInCartQuantity > 0;
        }
    },
    computed: {
        title() {
            return `${this.brand} ${this.product}`;
        },
        image() {
            return this.getSelectedVariant().variantImage;
        },
        inStock() {
            return this.getSelectedVariant().variantQuantity > 0;
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        cart: [],
        variants: [
            {
                variantId: 2234,
                variantColor: "green",
                variantImage: '../assets/vmSocks-green-onWhite.jpg',
                variantQuantity: 124,
                variantInCartQuantity: 0
            },
            {
                variantId: 2235,
                variantColor: "blue",
                variantImage: '../assets/vmSocks-blue-onWhite.jpg',
                variantQuantity: 5,
                variantInCartQuantity: 0
            }
        ],
        socksDetails: ["80% cotton", "20% polyester", "Gender-neutral"]
    },
    methods: {
        updateCart({ variant, add = true }) {
            if (add) {
                variant.variantInCartQuantity++;
                this.cart.push(variant.variantId);
            } else {
                for (let i = this.cart.length - 1; i >= 0; i--) {
                    if (this.cart[i] === variant.variantId) {
                        variant.variantInCartQuantity--;
                        this.cart.splice(i, 1);
                        return;
                    }
                }
            }
        }
    }
});