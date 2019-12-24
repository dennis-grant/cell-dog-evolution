var CDE = (function(module) {
	var getRandomNumber = module.getRandomNumber;
	var getRandomColor = module.getRandomColor;

	var DogDNA = function(_cellWidth, _cellHeight, _patternGeneratorClass) {
		var self = this;

		this.init = function(_cellWidth, _cellHeight, _patternGeneratorClass) {
			this.cellWidth = _cellWidth;
			this.cellHeight = _cellHeight;
			this.patternGeneratorClass = _patternGeneratorClass;
			this.patternGenerator = new _patternGeneratorClass(_cellWidth, _cellHeight);
			this.borderColor = getRandomColor();
			this.stripesSpec = this.patternGenerator.createPattern();

			this.mutationFunctions = [
				{func: this.mutateBorderColor, numOfPossibleMutations: 10},
				{func: this.mutateStripeColor, numOfPossibleMutations: 10 * this.stripesSpec.length},
				{func: this.mutateStripeDisplayOrder, numOfPossibleMutations: this.stripesSpec.length},
				{func: this.mutateStripeDimensions, numOfPossibleMutations: this.patternGenerator.getNumOfPossibleDimensions()}
			];
			
			this.totalNumberOfPossibleMutations = 0;
			for (var i = 0; i < this.mutationFunctions.length; i++) {
				this.totalNumberOfPossibleMutations += this.mutationFunctions[i].numOfPossibleMutations;
			}
		};

		this.copy = function() {
			var dnaCopy,
				specCopy;

			dnaCopy = new DogDNA(this.cellWidth, this.cellHeight, this.patternGeneratorClass);
			dnaCopy.borderColor = this.borderColor;
			dnaCopy.stripesSpec = [];
			for (var i = 0; i < this.stripesSpec.length; i++) {
				specCopy = {
					x: this.stripesSpec[i].x,
					y: this.stripesSpec[i].y,
					width: this.stripesSpec[i].width,
					height: this.stripesSpec[i].height,
					color: this.stripesSpec[i].color
				};

				dnaCopy.stripesSpec[i] = specCopy;
			}

			return dnaCopy;
		};

		this.mutate = function() {
			var randomNum,
				numberOfMutatons,
				index,
				func,
				mutations;

			randomNum = getRandomNumber(100);
			if (randomNum == 1) {
				numberOfMutations = 6;
			}
			else if (randomNum < 10) {
				numberOfMutations = 2;
			}
			else {
				numberOfMutations = 1;
			}

			mutations = [];
			for (var i = 1; i <= numberOfMutations; i++) {
				func = this.getMutationFunction();
				if (func != undefined) {
					//func = this.mutationFunctions[index];
					mutations[mutations.length] = func();
				}
			}

			return mutations;
		};

		this.getMutationFunction = function() {
			var probabilityIndex,
				probabilityRangeMax,
				funcIndex,
				func;

			probabilityIndex = getRandomNumber(this.totalNumberOfPossibleMutations);
			probabilityRangeMax = 0;
			funcIndex = 0;
			func = undefined;
			while (funcIndex < this.mutationFunctions.length && func == undefined) {
				probabilityRangeMax += this.mutationFunctions[funcIndex].numOfPossibleMutations;
				if (probabilityIndex <= probabilityRangeMax) {
					func = this.mutationFunctions[funcIndex].func;
				}
				else {
					funcIndex++;
				}
			}

			return func;
		};

		this.mutateBorderColor = function() {
			var oldVal;

			oldVal = self.borderColor;
			self.borderColor = getRandomColor();

			return {name: "border color", oldVal: oldVal, newVal: self.borderColor};
		};

		this.mutateStripeColor = function() {
			var oldVal;
			var spec;

			spec = self.getRandomStripeSpec();
			oldVal = spec.color;
			self.patternGenerator.changeStripeSpecColor(spec);

			return {name: "stripe color", oldVal: oldVal, newVal: spec.color};
		};

		this.mutateStripeDisplayOrder = function() {
			var spec,
				randomPos,
				oldVal;

			// remove random stripe-spec from list
			randomPos = getRandomNumber(self.stripesSpec.length) -  1;
			oldVal = randomPos;
			spec = self.stripesSpec[randomPos];
			self.stripesSpec.splice(randomPos, 1);

			// put back stripe-spec in a different position
			randomPos = getRandomNumber(self.stripesSpec.length) -  1;
			self.stripesSpec.splice(randomPos, 0, spec);

			return {name: "display order", oldVal: oldVal, newVal: randomPos};
		};

		this.mutateStripeDimensions = function() {
			var spec,
				oldVal;

			spec = self.getRandomStripeSpec();
			oldVal = spec.x + ", " + spec.y + ", " + spec.width + ", " + spec.height;
			self.patternGenerator.changeStripeSpecDimensions(spec);

			return {name: "dimensions", oldVal: oldVal, newVal: spec.x + ", " + spec.y + ", " + spec.width + ", " + spec.height};
		};

		this.getRandomStripeSpec = function() {
			return this.stripesSpec[getRandomNumber(this.stripesSpec.length) - 1];
		};

		this.init(_cellWidth, _cellHeight, _patternGeneratorClass);
	};

	module.DogDNA = DogDNA;

	return module;
}(CDE || {}));
