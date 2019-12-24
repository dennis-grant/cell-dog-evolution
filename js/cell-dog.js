var CDE = (function(module) {
	var getRandomNumber = module.getRandomNumber;
	var ColorMap = module.ColorMap;

	var CellDog = function(_dna, _width, _height) {
		var self = this;
		var CLOCK_TICK = 2;

		this.init = function(_dna, _width, _height) {
			this.dna = _dna;
			this.width = _width;
			this.height = _height;
			this.createControlElement();
			this.addStripes();
			this.addBorder();
			this.colorMap = undefined;
			this.cellIndex = -1;
			this.soul = undefined;
		};

		this.goInComa = function() {
			if (this.soul != undefined) {
				clearInterval(this.soul);
				this.soul = undefined;
			}
		};

		this.comeAlive = function() {
			if (this.house != undefined) {
				this.soul = setInterval(this.live, CLOCK_TICK);
			}
		};

		this.live = function() {
			var chanceOfBirthOnTick;
			var dogCount;

			if (self.house != undefined && self.house.lightsOn == true) {
				dogCount = self.house.occupiedCells.length;

				if (dogCount <= 10) {
					chanceOfBirthOnTick = 100;
				}
				else if (dogCount <= 20) {
					chanceOfBirthOnTick = 75;
				}
				else if (dogCount <= 30) {
					chanceOfBirthOnTick = 65;
				}
				else if (dogCount <= 40) {
					chanceOfBirthOnTick = 50;
				}
				else if (dogCount <= 50) {
					chanceOfBirthOnTick = 35;
				}
				else if (dogCount <= 60) {
					chanceOfBirthOnTick = 20;
				}
				else {
					chanceOfBirthOnTick = 0;
				}

				if (getRandomNumber(100) <= (chanceOfBirthOnTick/dogCount)) {
					self.reproduce();
				}
			}
			else if (self.house != undefined && self.house.lightsOn == false) {
				self.goInComa();
			}	
		};

		this.createControlElement = function() {
			this.controlElement = $('<div class="cell-dog"></div>');
			this.controlElement.css({width: this.width, height: this.height});
		};

		this.addStripes = function() {
			var spec;

			for (var i = 0; i < this.dna.stripesSpec.length; i++) {
				spec = this.dna.stripesSpec[i];
				this.addStripe(spec);
			}
		};

		this.addBorder = function() {
			this.borderStripes = [
				{x: 0, y: 0, width: this.width, height: 1, color: this.dna.borderColor},
				{x: this.width - 1, y: 1, width: 1, height: this.height - 2, color: this.dna.borderColor},
				{x: 0, y: this.height - 1, width: this.width, height: 1, color: this.dna.borderColor},
				{x: 0, y: 1, width: 1, height: this.height - 2, color: this.dna.borderColor}
			];

			for (var i = 0; i < this.borderStripes.length; i++) {
				this.addStripe(this.borderStripes[i]);
			}
		};

		this.addStripe = function(spec) {
			var stripe;

			stripe = $('<div class="stripe"></div>');
			stripe.css({top: spec.y, left: spec.x, width: spec.width, height: spec.height, "background-color": spec.color});
			this.controlElement.append(stripe);
		};

		this.getColorMap = function() {
			var spec;

			if (this.colorMap == undefined) {
				this.colorMap = new ColorMap(this.width, this.height);
			}
			for (var i = 0; i < this.dna.stripesSpec.length; i++) {
				spec = this.dna.stripesSpec[i];
				this.colorMap.addStripeToColorMap(spec);
			}

			for (var i = 0; i < this.borderStripes.length; i++) {
				this.colorMap.addStripeToColorMap(this.borderStripes[i]);
			}

			return this.colorMap;
		};

		this.occupyCell = function(dogHouse) {
			var cellIndex;

			cellIndex = dogHouse.getRandomEmptyCell();
			if (cellIndex != -1) {
				dogHouse.putDog(this, cellIndex);
			}
		};

		this.die = function() {
			if (this.house != undefined) {
				this.goInComa();
				this.house.removeDog(this);
			}
		};

		this.reproduce = function() {
			var childDNA;
			var child;
			var mutations;

			mutations = [];
			if (this.house != undefined) {
				childDNA = this.dna.copy();
				if (getRandomNumber(10) <= 3) {
					mutations = childDNA.mutate();
				}
				child = new CellDog(childDNA, this.width, this.height);
				child.occupyCell(this.house);
				child.comeAlive();

				if (mutations.length > 0 && this.house != undefined) {
					this.house.addMutations(mutations);
					this.house.controlElement.trigger({type: "dogMutated", before: this, after: child});
				}
			}
		};

		this.init(_dna, _width, _height);
	};

	module.CellDog = CellDog;

	return module;
}(CDE || {}));
