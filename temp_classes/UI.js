class UI {
    constructor(){
        this.caravan = undefined;
        this.eventManager = undefined;
    };

    notify(message, type){
        document.getElementById('updates-area').innerHTML = '<div class="update-' + type + '">Day '+ Math.ceil(this.caravan.day) + ': ' + message+'</div>' + document.getElementById('updates-area').innerHTML;
    };

    refreshStats(){
        //modify the dom
        document.getElementById('stat-day').innerHTML = Math.ceil(this.caravan.day);
        document.getElementById('stat-distance').innerHTML = Math.floor(this.caravan.distance);
        document.getElementById('stat-crew').innerHTML = this.caravan.crew;
        document.getElementById('stat-oxen').innerHTML = this.caravan.oxen;
        document.getElementById('stat-food').innerHTML = Math.ceil(this.caravan.food);
        document.getElementById('stat-money').innerHTML = this.caravan.money;
        document.getElementById('stat-firepower').innerHTML = this.caravan.firepower;
        document.getElementById('stat-weight').innerHTML = Math.ceil(this.caravan.weight) + '/' + this.caravan.capacity;

        //update caravan position
        document.getElementById('caravan').style.left = (380 * this.caravan.distance/gameSession.FINAL_DISTANCE) + 'px';
    };

    showAttack(firePower, gold){
        const attackDiv = document.getElementById('attack');
        attackDiv.classList.remove('hidden');

        //keep properties
        this.firepower = firepower;
        this.gold = gold;

        // //show firepower
        // document.getElementById('attack-description').innerHTML = 'Firepower: ' + firepower;

        document.getElementById('attack-description').innerHTML = (`Firepower: ${firepower}`);//'Firepower: ' + firepower;

        //init once
        if(!this.attackInitiated) {

          //fight
          document.getElementById('fight').addEventListener('click', this.fight.bind(this));

          //run away
          document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

          this.attackInitiated = true;
        }
    };

    fight(){
          let firepower = this.firepower;
          let gold = this.gold;

          let damage = Math.ceil(Math.max(0, firepower * 2 * Math.random() - this.caravan.firepower));

          //check there are survivors
          if(damage < this.caravan.crew) {
            this.caravan.crew -= damage;
            this.caravan.money += gold;
            this.notify(`${damage} people were killed fighting`, 'negative');
            this.notify(`Found ${gold} gold`, 'positive');
          }
          else {
            this.caravan.crew = 0;
            this.notify('Everybody died in the fight', 'negative');
          }

          //resume journey
          document.getElementById('attack').classList.add('hidden');
          this.game.resumeJourney();
    };

    runAway(){

          let firepower = this.firepower;

          let damage = Math.ceil(Math.max(0, firepower * Math.random()/2));

          //check there are survivors
          if(damage < this.caravan.crew) {
            this.caravan.crew -= damage;
            this.notify(`${damage} people were killed running`, 'negative');
          }
          else {
            this.caravan.crew = 0;
            this.notify('Everybody died running away', 'negative');
          }

          //remove event listener
          // document.getElementById('runaway').removeEventListener('click');

          //****NOTE:
          //line above causes 'runaway' button to never end the attack encounter, and each time you click it a crew member dies.

          //resume journey
          document.getElementById('attack').classList.add('hidden');
          this.game.resumeJourney();
    };

    showShop(products){

          //get shop area
          const shopDiv = document.getElementById('shop');
          shopDiv.classList.remove('hidden');

          //init the shop just once
          if(!this.shopInitiated) {


          this.shopDivHandler(e)

            this.shopInitiated = true;
          }

          //clear existing content
          const prodsDiv = document.getElementById('prods');
          prodsDiv.innerHTML = '';

          //show products
          let product;
          for(let i=0; i < products.length; i++) {
            product = products[i];
            prodsDiv.innerHTML += '<div class="product" data-qty="' + product.qty + '" data-item="' + product.item + '" data-price="' + product.price + '">' + product.qty + ' ' + product.item + ' - $' + product.price + '</div>';
    };

    shopDivHandler(e){
        //what was clicked
        let target = e.target || e.src;

        //exit button
        if(target.tagName == 'BUTTON') {
          //resume journey
          shopDiv.classList.add('hidden');
          gameSession.UI.game.resumeJourney();
        }
        else if(target.tagName == 'DIV' && target.className.match(/product/)) {

          gameSession.UI.buyProduct({
            item: target.getAttribute('data-item'),
            qty: target.getAttribute('data-qty'),
            price: target.getAttribute('data-price')
          });
        }
    };

    buyProduct(product){
        //check we can afford it
        if(product.price > gameSession.UI.caravan.money) {
          gameSession.UI.notify('Not enough money', 'negative');
          return false;
        }

        gameSession.UI.caravan.money -= product.price;

        gameSession.UI.caravan[product.item] += +product.qty;

        gameSession.UI.notify(`Bought ${product.qty} x ${product.item}`, 'positive');

        //update weight
        gameSession.UI.caravan.updateWeight();

        //update visuals
        gameSession.UI.refreshStats();
    }
};
