var CDE = (function(module) {
	var getRandomNumber = module.getRandomNumber;

	var DogHouse = function(_cellWidth, _cellHeight, _rowCount, _colCount, _backgroundColor) {
		this.init = function(_cellWidth, _cellHeight, _rowCount, _colCount, _backgroundColor) {
			this.cellWidth = _cellWidth;
			this.cellHeight = _cellHeight;
			this.rowCount = _rowCount;
			this.colCount = _colCount;
			this.lightsOn = false;
			this.mutations = [];

			this.dogs = {};
			this.occupiedCells = [];
			this.emptyCells = [];
			for (var i = 1; i <= (this.rowCount * this.colCount); i++) {
				this.emptyCells.push(i);
			}

			this.createControlElement();
			this.setBackgroundColor(_backgroundColor);
		};

		this.setBackgroundColor = function(color) {
			this.backgroundColor = color;
			this.controlElement.find(".bg").css({"background-color": this.backgroundColor});
		};

		this.turnLightsOn = function(val) {
			this.lightsOn = true;
		};

		this.turnLightsOff = function(val) {
			this.lightsOn = false;
		};

		this.addMutations = function(newMutations) {
			this.mutations = this.mutations.concat(newMutations);
		};

		this.getCellPos = function(cellIndex) {
			var row,
				col;

			row = Math.ceil(cellIndex / this.colCount);
			col = cellIndex % this.colCount;
			if (col == 0) {
				col = this.colCount;
			}

			return {row: ((row - 1) * this.cellHeight) + 2, col: ((col - 1) * this.cellWidth) + 2};
		};

		this.getRandomEmptyCell = function() {
			var cellIndex,
				i;

			if (this.emptyCells.length > 0) {
				i = getRandomNumber(this.emptyCells.length);
				cellIndex = this.emptyCells[i - 1];
			}
			else {
				cellIndex = -1;
			}

			return cellIndex;
		};

		this.getRandomOccupiedCell = function() {
			var cellIndex,
				i;

			if (this.occupiedCells.length > 0) {
				i = getRandomNumber(this.occupiedCells.length);
				cellIndex = this.occupiedCells[i - 1];
			}
			else {
				cellIndex = -1;
			}

			return cellIndex;
		};

		this.getRandomDog = function() {
			var cellIndex,
				dog;

			cellIndex = this.getRandomOccupiedCell();
			if (cellIndex != -1) {
				dog = this.getDog(cellIndex);
			}
			else {
				dog = undefined;
			}

			return dog;
		};

		this.getDog = function(cellIndex) {
			return this.dogs["cell" + cellIndex];
		};

		this.putDog = function(dog, cellIndex) {
			var cpos;

			this.dogs["cell" + cellIndex] = dog;
			this.occupiedCells.push(cellIndex);

			for (var i = this.emptyCells.length - 1; i >= 0; i--) {
				if (this.emptyCells[i] == cellIndex) {
					this.emptyCells.splice(i, 1);
				}
			}

			dog.cellIndex = cellIndex;
			dog.house = this;

			cpos = this.getCellPos(cellIndex);
			dog.controlElement.css({top: cpos.row, left: cpos.col});
			this.controlElement.find(".cells").append(dog.controlElement);

			this.controlElement.trigger({type: "dogAdded", dogCount: this.occupiedCells.length});
		};

		this.removeDog = function(dog) {
			var cpos;

			delete this.dogs["cell" + dog.cellIndex];
			this.emptyCells.push(dog.cellIndex);

			for (var i = this.occupiedCells.length - 1; i >= 0; i--) {
				if (this.occupiedCells[i] == dog.cellIndex) {
					this.occupiedCells.splice(i, 1);
				}
			}

			dog.cellIndex = -1;
			dog.house = undefined;
			dog.controlElement.remove();

			this.controlElement.trigger({type: "dogRemoved", dogCount: this.occupiedCells.length});

			return dog;
		};

		this.createControlElement = function() {
			this.controlElement = $(this.toHTML());
		};

		this.toHTML = function() {
			var html;

			html = '<div class="dog-house">';
			html += '  <div class="bg"></div>';
			html += '  <div class="cells"></div>';
			html += '</div>';

			return html;
		};

		this.init(_cellWidth, _cellHeight, _rowCount, _colCount, _backgroundColor);
	};

	module.DogHouse = DogHouse;

	return module;
}(CDE || {}));
