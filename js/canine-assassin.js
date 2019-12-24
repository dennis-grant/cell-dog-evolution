var CDE = (function(module) {
	var getRandomNumber = module.getRandomNumber;

	var CanineAssassin = function(_house) {
		var self = this;
		var CLOCK_TICK = 2;

		this.init = function(_house) {
			this.house = _house;
			this.soul = undefined;
		};

		this.goInComa = function() {
			if (this.soul != undefined) {
				clearInterval(this.soul);
				this.soul = undefined;
			}
		};

		this.comeAlive = function() {
			this.soul = setInterval(this.live, CLOCK_TICK);
		};

		this.live = function() {
			var chanceOfHuntOnTick;
			var dogCount;

			if (self.house != undefined && self.house.lightsOn == true) {
				dogCount = self.house.occupiedCells.length;

				if (dogCount <= 10) {
					chanceOfHuntOnTick = 0;
				}
				else if (dogCount <= 20) {
					chanceOfHuntOnTick = 20;
				}
				else if (dogCount <= 30) {
					chanceOfHuntOnTick = 35;
				}
				else if (dogCount <= 40) {
					chanceOfHuntOnTick = 50;
				}
				else if (dogCount <= 50) {
					chanceOfHuntOnTick = 65;
				}
				else if (dogCount <= 60) {
					chanceOfHuntOnTick = 75;
				}
				else {
					chanceOfHuntOnTick = 100;
				}

				if (getRandomNumber(100) <= chanceOfHuntOnTick) {
					self.hunt();
				}
			}
			else if (self.house != undefined && self.house.lightsOn == false) {
				self.goInComa();
			}
		};

		this.hunt = function() {
			var dog;

			dog = this.findDog(3);
			if (dog != undefined) {
				this.killDog(dog);
			}
		};

		this.findDog = function(numberOfDogsToCompare) {
			var dogs,
				tmpDog,
				colorDiff,
				tmpColorDiff,
				selectedDog;

			dogs = [this.house.getRandomDog()];
			if (numberOfDogsToCompare > 1) {
				dogs[1] = this.findDog(numberOfDogsToCompare - 1);
			}

			colorDiff = 0;
			selectedDog = undefined;
			for (var i = 0; i < dogs.length; i++) {
				tmpDog = dogs[i];
				if (tmpDog != undefined) {
					tmpColorDiff = tmpDog.getColorMap().compareTo(this.house.backgroundColor);
					if (tmpColorDiff > colorDiff) {
						selectedDog = tmpDog;
						colorDiff = tmpColorDiff;
					}
				}
			}

			return selectedDog;
		};

		this.killDog = function(dog) {
			if (dog != undefined) {
				dog.die();
			}
		};

		this.init(_house);
	};

	module.CanineAssassin = CanineAssassin;

	return module;
}(CDE || {}));
