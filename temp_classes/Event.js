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
//
// EventManager
// Properties:
// game
// eventTypes
// Methods:
// generateEvent()
// stateChangeEvent(eventData)
// shopEvent(eventData)
// attackEvent(eventData)

class Event {
    constructor(){

    }
}


var OregonH = OregonH || {};

OregonH.Event = {};

OregonH.Event.eventTypes = [
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -3,
    text: 'Food intoxication. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -50,
    text: 'Meteor shower. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'crew',
    value: +50,
    text: 'Aphrodisiac + time: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -4,
    text: 'Flu outbreak. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'food',
    value: -10,
    text: 'Worm infestation. Food lost: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: +10,
    text: 'Cannibalism. (You ate someone not in your crew.) Food gained: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'money',
    value: -50,
    text: 'Pick pockets steal $'
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'money',
    value: +1000,
    text: 'Gold! Money gained: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'oxen',
    value: -1,
    text: 'Ox flu outbreak. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Found wild berries. Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Found wild berries. Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'oxen',
    value: 1,
    text: 'Found wild oxen. New oxen: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'oxen',
    value: 15,
    text: 'Rut season: New oxen: '
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      {item: 'food', qty: 20, price: 50},
      {item: 'oxen', qty: 1, price: 200},
      {item: 'firepower', qty: 2, price: 50},
      {item: 'crew', qty: 5, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      {item: 'food', qty: 30, price: 50},
      {item: 'oxen', qty: 1, price: 200},
      {item: 'firepower', qty: 2, price: 20},
      {item: 'crew', qty: 10, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'positive',
    text: 'You have found a recently abandoned house',
    products: [
      {item: 'food', qty: 45, price: 0},
      {item: 'firepower', qty: 12, price: 0},
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Smugglers sell various goods',
    products: [
      {item: 'food', qty: 20, price: 60},
      {item: 'oxen', qty: 1, price: 300},
      {item: 'firepower', qty: 2, price: 80},
      {item: 'crew', qty: 5, price: 60}
    ]
  },
  {
      type: 'ATTACK',
      notification: 'negative',
      text: 'Bandits are attacking you'
    },
    {
        type: 'ATTACK',
        notification: 'negative',
        text: 'Bears are attacking you'
      },
    {
      type: 'ATTACK',
      notification: 'negative',
      text: 'Bandits are attacking you'
    },
    {
      type: 'ATTACK',
      notification: 'negative',
      text: 'Bandits are attacking you'
    }
  ];
  OregonH.Event.generateEvent = function(){
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

  OregonH.Event.stateChangeEvent = function(eventData) {
    //can't have negative quantities
    if(eventData.value + this.caravan[eventData.stat] >= 0) {
      this.caravan[eventData.stat] += eventData.value;
      this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
    }
  };

  OregonH.Event.shopEvent = function(eventData) {
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

  //prepare an attack event
  OregonH.Event.attackEvent = function(eventData){
    let firepower = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_FIREPOWER_AVG);
    let gold = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_GOLD_AVG);

    this.ui.showAttack(firepower, gold);
  };
