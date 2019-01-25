class Game {
      // Initialize the Game Object
      constructor() {
        // Create dependent Objects
        this.ui = new UI(this);
        this.eventManager = new eventManager(this);
        this.caravan = new Caravan(this, 0, 0, 30, 80, 2, 300, 2); //do i need to pass 'this' in as a reference?

        // pass references - set dependencies
        this.caravan.ui = this.ui;
        this.caravan.eventManager = this.eventManager;

        this.ui.caravan = this.caravan;
        this.ui.eventManager = this.eventManager;

        this.eventManager.caravan = this.caravan;
        this.eventManager.ui = this.ui;

        this.WEIGHT_PER_OX = 20;
        this.WEIGHT_PER_PERSON = 2;
        this.FOOD_WEIGHT = 0.6;
        this.FIREPOWER_WEIGHT = 5;
        this.GAME_SPEED = 800;
        this.DAY_PER_STEP = 0.2;
        this.FOOD_PER_PERSON = 0.02;
        this.FULL_SPEED = 5;
        this.SLOW_SPEED = 3;
        this.FINAL_DISTANCE = 1000;
        this.EVENT_PROBABILITY = 0.15;
        this.ENEMY_FIREPOWER_AVG = 5;
        this.ENEMY_GOLD_AVG = 50; //variables attached to OregonH namespace

        // begin adventure!
        this.startJourney();
    };

    startJourney(){
        this.gameActive = true;
        this.previousTime = null;
        this.ui.notify('A great adventure begins', 'positive');

        this.step();
    };

    step(timestep){
        //starting, setup the previous time for the first time
        if(!this.previousTime){
          this.previousTime = timestamp;
          this.updateGame();
        }

        //time difference
        let progress = timestamp - this.previousTime;

        //game update
        if(progress >= this.GAME_SPEED) {
          this.previousTime = timestamp;
          this.updateGame();
        }

        //we use "bind" so that we can refer to the context "this" inside of the step method
        if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
    };

    updateGame(){
        //day update
        this.caravan.day += this.DAY_PER_STEP;

        //food consumption
        this.caravan.consumeFood();

        //game over no food
        if(this.caravan.food === 0) {
          this.ui.notify('Your caravan starved to death', 'negative');
          this.gameActive = false;
          return;
        }

        //update weight
        this.caravan.updateWeight();

        //update progress
        this.caravan.updateDistance();

        //show stats
        this.ui.refreshStats();

        //check if everyone died
        if(this.caravan.crew <= 0) {
          this.caravan.crew = 0;
          this.ui.notify('Everyone died', 'negative');
          this.gameActive = false;
          return;
        }

        //check win game
        if(this.caravan.distance >= this.FINAL_DISTANCE) {
          this.ui.notify('You have returned home!', 'positive');
          this.gameActive = false;
          return;
        }

        //random events logic will go here..
          if(Math.random() <= this.EVENT_PROBABILITY) {
            this.eventManager.generateEvent();
          }
      };

        pauseJourney(){
              this.gameActive = false;
        };

        resumeJourney(){
            this.gameActive = true;
            this.step();
        };
};
