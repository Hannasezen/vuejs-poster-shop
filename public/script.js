new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [
            { title: 'Item1', price: 9.99 },
            { title: 'Item2', price: 7.99 },
            { title: 'Item3', price: 6.99 }
        ],
        cart: []
    },
    methods: {
        addItem: function (index) {
            this.cart.push(this.items[index]);
            this.total += this.items[index].price;
        }
    }
});