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

                <div>
                    <h2>Reviews</h2>
                    <p v-if="!reviews.length">There is no review yet.</p>
                    <ul>
                        <li v-for="review in reviews">
                            <p>{{ review.name }}</p>
                            <p>{{ review.rating }}</p>
                            <p>{{ review.review }}</p>
                            <p v-if="review.recommend">This user recommend this product.</p>
                        </li>
                    </ul>
                </div>

                <product-review v-on:review-submitted="addReview"></product-review>
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
            onSale: false,
            reviews: []
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
        },
        addReview(productReview) {
            this.reviews.push(productReview);
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

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" type="text" v-model="name">
            </p>
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <p>Would you recommend this product?</p>
            <div>
                <input v-model="recommend" type="radio" id="recommend-yes" name="recommend" value="yes">
                <label for="recommend-yes">Yes</label>
            </div>
            <div>
                <input v-model="recommend" type="radio" id="recommend-no" name="recommend" value="no">
                <label for="recommend-no">No</label>
            </div>

            <p>
                <button type="submit">Submit</button>
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend === "yes" ? true : false
                };
    
                this.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
                this.errors = [];
                return;
            }

            if (!this.name && !this.errors.includes('Name required.')) {
                this.errors.push('Name required.');
            }

            if (!this.rating && !this.errors.includes('Rating required.')) {
                this.errors.push('Rating required.');
            }
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