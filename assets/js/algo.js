let Algo = {

    numbers: [0, 1, 2, 3],
    numberList: [],
    error: true,

    init: function(level) {
        if (0 === level) {
            console.log('Algo init: le level ne peut pas être nul');
            level = 1;
        }

        this.numberList = [];

        //nombre de bombes
        this.numbers[0] = this.f0(level);

        //nombre de un
        this.numbers[1] = this.f1(level);

        //reste de case à remplir:
        let rest = SIZE*SIZE - this.numbers[0] - this.numbers[1];

        //nombre de deux
        this.numbers[2] = this.f2(level, rest);

        //nombre de trois
        this.numbers[3] = this.f3(level, rest);

        // la somme de tous les nombre doit être égale à SIZE*SIZE
        if (this.checkIntegrity()) {
            this.error = false;
        } else {
            console.error('Algo integrity failed', this.numbers);
            this.error = true;
        }

        this.makeList();
    },

    makeList: function() {
        let _self = this;

        $.each(this.numbers, function (value, number) {
            for (let i = 0; i < number; i++) {
                _self.numberList.push(value);
            }
        });

        //unorder the numberlist
        this.numberList = this.arrayShuffle(this.numberList);
    },

    arrayShuffle: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },

    checkIntegrity: function () {
        let total = this.numbers[0] + this.numbers[1] + this.numbers[2] + this.numbers[3];

        let integrity = total === SIZE*SIZE;

        if (!integrity) { alert('not integrity'); }

        return integrity;
    },

    f0: function(x) {
        if (0 === x) {
            console.log('f0(x) : x ne peut pas être nul');
            x = 1;
        }

        let y = 9*Math.exp(Math.log(0.5)/x);

        return this.randomRound(y);
    },

    f1: function (x) {
        if (0 === x) {
            console.log('f1(x) : x ne peut pas être nul');
            x = 1;
        }

        let y = (23 - 15*Math.exp(Math.log(0.5)/x) - 1/(4+Math.log(x)));

        return this.randomRound(y);
    },

    f2: function (x, max) {
        if (0 === x) {
            console.log('f2(x) : x ne peut pas être nul');
            x = 1;
        }

        return Math.floor(Math.pow(Math.sin(x), 2) * max);
    },

    f3: function (x, max) {
        if (0 === x) {
            console.log('f3(x) : x ne peut pas être nul');
            x = 1;
        }

        return Math.ceil(Math.pow(Math.cos(x), 2) * max);
    },

    randomRound: function (y) {
        //ajustement aléatoire
        //let ajust = 2.093/Math.PI;
        let ajust = Math.PI/10;

        switch (Math.ceil(Math.random() * 2)) {
            case 1:
                y += ajust;
                break;
            case 2:
            default:
                y -= ajust;
        }

        // arrondi ou troncature aléatoire
        switch (Math.ceil(Math.random() * 3)) {
            case 1:
                return Math.ceil(y);
            case 2:
                return Math.floor(y);
            case 3:
            default:
                return Math.round(y);
        }
    }
};
