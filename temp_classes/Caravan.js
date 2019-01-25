class Caravan {
    constructor(day, distance, crew, food, oxen, money, firepower){
        this.day = day;
        this.distance = distance;
        this.crew = crew;
        this.food = food;
        this.oxen = oxen;
        this.money = money;
        this.firepower = firepower;

        this.ui = undefined;
    };


    updateWeight(){
        let droppedFood = 0;
        let droppedGuns = 0;

        //how much can the caravan carry
        this.capacity = this.oxen * gameSession.WEIGHT_PER_OX + this.crew * gameSession.WEIGHT_PER_PERSON;

        //how much weight do we currently have
        this.weight = this.food * gameSession.FOOD_WEIGHT + this.firepower * gameSession.FIREPOWER_WEIGHT;

        //drop things behind if it's too much weight
        //assume guns get dropped before food
        while(this.firepower && this.capacity <= this.weight) {
          this.firepower--;
          this.weight -= gameSession.FIREPOWER_WEIGHT;
          droppedGuns++;
        }

        if(droppedGuns) {
          this.ui.notify(`Left ${droppedGuns} guns behind`, 'negative');
        }

        while(this.food && this.capacity <= this.weight) {
          this.food--;
          this.weight -= gameSession.FOOD_WEIGHT;
          droppedFood++;
        }

        if(droppedFood) {
          this.ui.notify(`Left ${droppedFood} guns behind`, 'negative');
        }
    };

    updateDistance(){
        //the closer to capacity, the slower
        let diff = this.capacity - this.weight;
        let speed = gameSession.SLOW_SPEED + diff/this.capacity * gameSession.FULL_SPEED;
        this.distance += speed;
    };

    consumeFood(){
        this.food -= this.crew * gameSession.FOOD_PER_PERSON;

        if(this.food < 0) {
          this.food = 0;
        }
    };
}
