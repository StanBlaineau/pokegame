


let vue = new Vue({
    el: '#pokevue',
    data: {
        matrix: null,
        guessMatrix: null,
        size: SIZE,
        totalScore: 0,
        score: 0,
        totalCardsToFind: 0,
        totalUnguessedOne: 0,
        lifes: LIFES,
        sides: {
            lines: [],
            columns: []
        },
        states: {
            end: false,
            success: false
        },
        level: 1,
        cursor: {
            i: 0,
            j: 0
        }
    },

    created: function () {
        document.addEventListener('keypress', this.moveCursor);
    },

    destroyed() {
        document.removeEventListener('keypress', this.moveCursor);
    },

    mounted: function () {
        this.start();
    },

    methods: {
        getConsigneClasses: function () {
            return {
                'alert-primary': !this.states.end,
                'alert-success': this.states.end && this.states.success,
                'alert-danger': this.states.end && !this.states.success
            };
        },

        getCardClassClass: function (i, j, guessed) {
            return {
                cursoredCard: i === this.cursor.i && j === this.cursor.j,
                guessed: guessed
            };
        },

        initStates: function () {
            this.states.end = false;
            this.states.success = false;
        },

        initMatrix: function (n) {
            if (!$.isArray(this.matrix)) {
                this.matrix = [];
            }

            if (!$.isArray(this.guessMatrix)) {
                this.guessMatrix = [];
            }

            for (let i = 0; i < n; i++) {
                if (!$.isArray(this.matrix[i])) {
                    this.matrix[i] = [];
                }

                if (!$.isArray(this.guessMatrix[i])) {
                    this.guessMatrix[i] = [];
                }

                for (let j = 0; j < n; j++) {
                    this.guessMatrix[i][j] = [false, false, false, false];
                    this.matrix[i][j] = {
                        value: 0,
                        guessed: false
                    };
                }
            }
        },

        initSides: function (n) {
            for (let i = 0; i < n; i++) {
                this.sides.lines[i] = {
                    total: 0,
                    bomb: 0
                }
            }

            for (let j = 0; j < n; j++) {
                this.sides.columns[j] = {
                    total: 0,
                    bomb: 0
                }
            }
        },

        setMatrix: function (n) {
            this.totalCardsToFind = 0;

            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {

                    let value = Algo.numberList.pop();
                    this.matrix[i][j].value = value;

                    // set the sides
                    if (0 === this.matrix[i][j].value) {
                        this.sides.lines[i].bomb++;
                        this.sides.columns[j].bomb++;
                    } else {
                        this.sides.lines[i].total += value;
                        this.sides.columns[j].total += value;

                        if (1 !== value) {
                            this.totalCardsToFind++;
                        } else {
                            this.totalUnguessedOne++;
                        }
                    }
                }
            }
        },

        decreaseLife: function() {
            this.lifes--;

            this.score -= 10;
            if (this.score < 0) { this.score = 0; }

            if (this.lifes <= 0) {
                this.endGame(false);
            }
        },

        guessCard: function (i,j) {
            this.showCard(i,j);

            let value = this.matrix[i][j].value;

            if (0 === value) {
                this.decreaseLife();
            } else {
                this.setScore(value);

                if (1 === value) {
                    this.totalUnguessedOne--;
                }

                this.clearGuessCard(i, j);

                if (this.countCardsGuessed() === this.totalCardsToFind) {
                    this.endGame(true);
                }
            }

            //en attendant de trouver une solution pour un listener sur les propriétés guessed
            // vm.$watch('a', function (newValue, oldValue) ?
            this.$forceUpdate();
        },

        clearGuessCard: function (i,j) {
            let _self = this;
            $.each(this.guessMatrix[i][j], function (index, value) {
                _self.guessMatrix[i][j][index] = false;
            });
        },

        showCard: function (i,j) {
            this.matrix[i][j].guessed = true;
        },

        getUniqueKey: function (i,j) {
            return i.toString().concat('', j.toString());
        },

        getRowUniqueKey: function (i) {
            return 'row'.concat('', i.toString())
        },

        endGame: function (success) {
            this.states.success = success;
            this.states.end = true;

            // then reveal all cards
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    this.matrix[i][j].guessed = true;
                }
            }
        },

        countCardsGuessed: function () {
            let count = 0;

            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    if (this.matrix[i][j].guessed && 0 !== this.matrix[i][j].value && 1 !== this.matrix[i][j].value) {
                        count++;
                    }
                }
            }

            return count;
        },

        initDefaultValues: function () {
            this.level = 1;
            this.totalScore = 0;
            this.score = 0;
            this.lifes = LIFES;
            this.totalUnguessedOne = 0;
        },

        start: function () {
            Algo.init(this.level);
            this.initMatrix(this.size);
            this.initSides(this.size);
            this.setMatrix(this.size);
            this.initStates();
        },

        restart: function() {
            this.initDefaultValues();
            this.start();
        },

        nextLevel: function () {
            this.level++;
            this.totalScore += this.score + this.totalUnguessedOne;
            this.score = 0;
            this.start();

            this.$forceUpdate();
        },

        setScore: function(adding) {
            if (0 === this.score) {
                this.score = adding;
            } else {
                this.score *= adding;
            }
        },

        moveCursor: function (event) {
            switch (event.key.toLowerCase()) {
                case 'z':
                    // go up
                    this.cursor.i--;
                    if (this.cursor.i < 0) { this.cursor.i = SIZE - 1; }
                    break;
                case 's':
                    //go down
                    this.cursor.i++;
                    if (this.cursor.i > SIZE - 1) { this.cursor.i = 0; }
                    break;
                case 'q':
                    //go left
                    this.cursor.j--;
                    if (this.cursor.j < 0) { this.cursor.j = SIZE - 1; }
                    break;
                case 'd':
                    //go right
                    this.cursor.j++;
                    if (this.cursor.j > SIZE - 1) { this.cursor.j = 0; }
                    break;
            }
        },

        setCardGuess: function (index) {
            let i = this.cursor.i;
            let j = this.cursor.j;

            if (!this.matrix[i][j].guessed) {
                this.guessMatrix[i][j][index] = !this.guessMatrix[i][j][index];
                this.$forceUpdate();
            }
        }
    }
});