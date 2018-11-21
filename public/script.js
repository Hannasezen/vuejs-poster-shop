const PRICE = 9.99;
const LOAD_NUM = 10;

var pusher = new Pusher('228e6a0602902cd71bd7', {
    cluster: 'ap1',
    encrypted: true
});

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        results: [],
        cart: [],
        newSearch: '90s',
        lastSearch: '',
        loading: false,
        price: PRICE,
        pusherUpdate: false
    },
    mounted: function() {
        this.onSubmit();

        var vue = this;
        var elem = document.getElementById('product-list-bottom')
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function() {
            vue.appendItems();
        });
        var channel = pusher.subscribe('cart');
        channel.bind('update', function(data){
            vue.pusherUpdate = true;
            vue.cart = data;
            vue.total = 0;
            for(let i = 0; i < vue.cart.length; i++) {
                vue.total += PRICE * vue.cart[i].qty;
            }
        })
    },
    filters: {
        currency: function(price) {
            return '$'.concat(price.toFixed(2));
      }
    },
    computed: {
        noMoreItems: function() {
            return this.items.length === this.results.length && this.results.length > 0;
        }
    },
    watch: {
        cart: {
            handler: function(val) {
                if(!this.pusherUpdate) {
                    this.$http.post('/cart_update', val);
                } else {
                    this.pusherUpdate = false;
                }           
            },
            deep: true
        }       
    },
    methods: {
        appendItems: function() {
            if(this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }            
        },
        onSubmit: function () {
            if(this.newSearch.length) {
                this.items = [];
                this.loading = true;
                this.$http
                .get('/search/'.concat(this.newSearch))
                .then(function(res) {
                    this.lastSearch = this.newSearch;
                    this.results = res.data,
                    this.appendItems();
                    this.loading = false;
                })
                .catch(function(er) {
                    console.log(er);
                });
            }
        },
        addItem: function (index) {
            let item = this.items[index];
            let found = false;
            for(let i = 0; i < this.cart.length; i++) {
                if(this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }
            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE,
                    link: item.link
                });
            }
            
            this.total += PRICE;
        },
        inc: function(item) {
            item.qty++;
            this.total += PRICE;
        },
        dec: function(item) {
            item.qty--;
            this.total -= PRICE;
            if (item.qty <= 0) {
                for(let i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }     
});


