class Product {
    constructor(item, qty, price){
        this.item = item;
        this.qty = qty;
        this.price = price;
    }
};

class EventType {
    constructor(type, notification, stat=undefined, value=undefined, text, products=undefined){
        this.type = type
        this.notification = notification
        this.stat = stat
        this.value = value
        this.text = text
        this.products = products
    }

};

class eventManager {
    constructor(){

        this.gameSession = undefined;

        this.event1 = undefined;
        this.event2 = undefined;
        this.event3 = undefined;
        this.event4 = undefined;
        this.event5 = undefined;
        this.event6 = undefined;
        this.event7 = undefined;
        this.event8 = undefined;
        this.event9 = undefined;
        this.event10 = undefined;
        this.event11 = undefined;
        this.event12 = undefined;
        this.event13 = undefined;
        this.event14 = undefined;
        this.event15 = undefined;
        this.event16 = undefined;
        this.event17 = undefined;

        this.food1 = new Product('food', 20, 50);
        this.food2 = new Product('food', 30, 50);
        this.food3 = new Product('food', 1, 0);
        this.food4 = new Product('food', 20, 60);

        this.oxen1 = new Product('oxen', 1, 200);
        this.oxen2 = new Product('oxen', 1, 300);

        this.firepower1 = new Product('firepower', 2, 50);
        this.firepower2 = new Product('firepower', 2, 20);
        this.firepower3 = new Product('firepower', 1, 0);
        this.firepower4 = new Product('firepower', 2, 80);

        this.crew1 = new Product('crew', 5, 80);
        this.crew2 = new Product('crew', 10, 80);
        this.crew3 = new Product('crew', 5, 60);



        this.eventTypes = [
//stat-changes
            this.event1 = new EventType('STAT-CHANGE', 'negative', 'crew', -3, 'Food intoxication. Casualties: '),
            this.event2 = new EventType('STAT-CHANGE', 'negative', 'crew', -50, 'Meteor shower. Casualties: '),
            this.event3 = new EventType('STAT-CHANGE', 'positive', 'crew', 2, 'Aphrodisiac + time. Crew gained: '),
            this.event4 = new EventType('STAT-CHANGE', 'negative', 'crew', -4, 'Flu outbreak. Casualties: '),
            this.event5 = new EventType('STAT-CHANGE', 'negative', 'food', -10, 'Worm infestation. Food lost: '),
            this.event6 = new EventType('STAT-CHANGE', 'positive', 'food', 10, 'Cannibalism. (You ate someone not in your crew.) Food gained: '),
            this.event7 = new EventType('STAT-CHANGE', 'negative', 'money', -50, 'Pick pockets steal $'),
            this.event8 = new EventType('STAT-CHANGE', 'positive', 'money', 200, 'Gold! Money gained: '),
            this.event9 = new EventType('STAT-CHANGE', 'negative', 'oxen', -2, 'Ox flu outbreak. Casualties: '),
            this.event10 = new EventType('STAT-CHANGE', 'positive', 'food', 20, 'Found wild berries. Food added: '),
            this.event11 = new EventType('STAT-CHANGE', 'positive', 'oxen', 1, 'Found wild oxen. New oxen: '),
            this.event12 = new EventType('STAT-CHANGE', 'positive', 'crew', 3, 'Rutting season: New oxen: '),

//shops
            this.event13 = new EventType('SHOP', 'neutral', undefined, undefined, 'You have found a shop', [this.crew1, this.firepower1, this.firepower2, this.oxen1, this.food1]),
            this.event14 = new EventType('SHOP', 'neutral', undefined, undefined, 'You have found a shop', [this.firepower4, this.oxen2, this.food4, this.crew2]),
            this.event15 = new EventType('SHOP', 'neutral', undefined, undefined, 'You found a very tiny hole in space-time.', [this.food3, this.firepower3]),
            this.event16 = new EventType('SHOP', 'neutral', undefined, undefined, 'Smugglers sell various goods', [this.firepower4, this.oxen2, this.food2, this.crew3]),

//attack
            this.event17 = new EventType('ATTACK', 'negative', undefined, undefined, 'Bandits are attacking you'),
            this.event18 = new EventType('ATTACK', 'negative', undefined, undefined, 'Bears are attacking you'),
            this.event19 = new EventType('ATTACK', 'negative', undefined, undefined, 'Bandits are attacking you'),
            this.event17 = new EventType('ATTACK', 'negative', undefined, undefined, 'Bandits are attacking you')
        ]
    }

    generateEvent(){
        //pick random one
        let eventIndex = Math.floor(Math.random() * this.eventTypes.length);
        const eventData = this.eventTypes[eventIndex];

        //events that consist in updating a stat
        if(eventData.type == 'STAT-CHANGE') {
          this.stateChangeEvent(eventData);
        }

        //shops
        else if(eventData.type == 'SHOP') {
          //pause game
          this.gameSession.pauseJourney();

          //notify user
          this.ui.notify(eventData.text, eventData.notification);

          //prepare event
          this.shopEvent(eventData);
        }

        //attacks
        else if(eventData.type == 'ATTACK') {
          //pause game
          this.gameSession.pauseJourney();

          //notify user
          this.ui.notify(eventData.text, eventData.notification);

          //prepare event
          this.attackEvent(eventData);
        }
    };

    stateChangeEvent(eventData){
        //can't have negative quantities
        if(eventData.value + this.caravan[eventData.stat] >= 0) {
          this.caravan[eventData.stat] += eventData.value;
          this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
        }
    };

    shopEvent(eventData){
        //number of products for sale
        const numProds = Math.ceil(Math.random() * 4);

        //product list
        let products = []; // Ahhhh!
        let j, priceFactor;

        for(let i = 0; i < numProds; i++) {
          //random product
          j = Math.floor(Math.random() * eventData.products.length);

          //multiply price by random factor +-30%
          priceFactor = 0.7 + 0.6 * Math.random();

          products.push({
            item: eventData.products[j].item,
            qty: eventData.products[j].qty,
            price: Math.round(eventData.products[j].price * priceFactor)
          });
        }

        this.ui.showShop(products);
    };

    attackEvent(eventData){
        let firepower = Math.round((0.7 + 0.6 * Math.random()) * this.gameSession.ENEMY_FIREPOWER_AVG);
        let gold = Math.round((0.7 + 0.6 * Math.random()) * this.gameSession.ENEMY_GOLD_AVG);

        this.ui.showAttack(firepower, gold);
    }

};
