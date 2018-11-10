new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [
            { id: 1, title: 'Item1', price: 9.99 },
            { id: 2, title: 'Item2', price: 7.99 },
            { id: 3, title: 'Item3', price: 6.99 }
        ],
        cart: []
    },
    methods: {
        addItem: function (index) {
            let item = this.items[index];
            let found = false;
            for(let i = 0; i < this.cart.length; i++) {
                if(this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].qty++;
                }
            }
            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: item.price
                });
            }
            
            this.total += item.price;
        }
    }
});