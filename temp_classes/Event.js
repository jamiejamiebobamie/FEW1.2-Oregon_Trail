// Challenge 3: Create an Event Class, and classes for the other Objects used by Event.
//
// Look closely at Event.js. This file creates several Objects.
//
// Event - Holds and manages all of the Event functionality.
// eventTypes - is an Array of Objects. These Objects all describe an Event that can occur in the game. There are different types of events here
// STAT-CHANGE
// ATTACK
// SHOP
// Within a 'SHOP' event there is a products property. This is an Array of Objects. These Objects describe a product a player can buy from the shop. These Objects have the following properties:
//
// item
// qty
// price

// You should make a Class for each of these Objects! Here is a list of the Classes their properties and methods:
//
// Product
// Properties:
// item
// qty
// price

// EventType
// Properties:
// type
// notification
// stat
// value
// text
// products

// EventManager
// Properties:
// game
// eventTypes
// Methods:
// generateEvent()
// stateChangeEvent(eventData)
// shopEvent(eventData)
// attackEvent(eventData)






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

        this.eventTypes = [
//stat-changes
            event1 = new EventType('STAT-CHANGE', 'negative', 'crew', -3, 'Food intoxication. Casualties: '),
            event2 = new EventType('STAT-CHANGE', 'negative', 'crew', -50, 'Meteor shower. Casualties: '),
            event3 = new EventType('STAT-CHANGE', 'positive', 'crew', 2, 'Aphrodisiac + time. Crew gained: '),
            event4 = new EventType('STAT-CHANGE', 'negative', 'crew', -4, 'Flu outbreak. Casualties: '),
            event5 = new EventType('STAT-CHANGE', 'negative', 'food', -10, 'Worm infestation. Food lost: '),
            event6 = new EventType('STAT-CHANGE', 'positive', 'food', 10, 'Cannibalism. (You ate someone not in your crew.) Food gained: '),
            event7 = new EventType('STAT-CHANGE', 'negative', 'money', -50, 'Pick pockets steal $'),
            event8 = new EventType('STAT-CHANGE', 'positive', 'money', 200, 'Gold! Money gained: '),
            event9 = new EventType('STAT-CHANGE', 'negative', 'oxen', -2, 'Ox flu outbreak. Casualties: '),
            event10 = new EventType('STAT-CHANGE', 'positive', 'food', 20, 'Found wild berries. Food added: '),
            event11 = new EventType('STAT-CHANGE', 'positive', 'oxen', 1, 'Found wild oxen. New oxen: '),
            event12 = new EventType('STAT-CHANGE', 'positive', 'crew', 3, 'Rutting season: New oxen: '),

//shops
            event13 = new EventType('SHOP', 'neutral', undefined, undefined, 'You have found a shop', [new Products('food', 20, 50), new Products('oxen', 1, 200), new Products('firepower', 2, 50), new Products('crew', 5, 80)]),
            event14 = new EventType('SHOP', 'neutral', undefined, undefined, 'You have found a shop', [new Products('food', 30, 50), new Products('oxen', 1, 200), new Products('firepower', 2, 20), new Products('crew', 10, 80)]),
            event15 = new EventType('SHOP', 'neutral', undefined, undefined, 'You found a very tiny hole in space-time.', [new Products('food', 1, 0), new Products('firepower', 1, 0)]),
            event16 = new EventType('SHOP', 'neutral', undefined, undefined, 'Smugglers sell various goods', [new Products('food', 20, 60), new Products('oxen', 1, 300), new Products('firepower', 2, 80), new Products('crew', 5, 60)]),

//attack
            event17 = new EventType('ATTACK', 'negative', undefined, undefined, 'Bandits are attacking you'),
            event18 = new EventType('ATTACK', 'negative', undefined, undefined, 'Bears are attacking you'),
            event19 = new EventType('ATTACK', 'negative', undefined, undefined, 'Bandits are attacking you'),
            event17 = new EventType('ATTACK', 'negative', undefined, undefined, 'Bandits are attacking you')
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
          this.game.pauseJourney();

          //notify user
          this.ui.notify(eventData.text, eventData.notification);

          //prepare event
          this.shopEvent(eventData);
        }

        //attacks
        else if(eventData.type == 'ATTACK') {
          //pause game
          this.game.pauseJourney();

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
        let products = [];
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
        let firepower = Math.round((0.7 + 0.6 * Math.random()) * gameSession.ENEMY_FIREPOWER_AVG);
        let gold = Math.round((0.7 + 0.6 * Math.random()) * gameSession.ENEMY_GOLD_AVG);

        this.ui.showAttack(firepower, gold);
    }

};
