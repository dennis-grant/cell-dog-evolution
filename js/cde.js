var CDE = (function(module) {
	var colorPallette = ["#ff0000", "#00ff00", "#0000ff", "#cccccc", "#000000", "#669933", "#cc0066", "#0099cc", "#ffff00", "#996666"];
	var hexDigits = "0123456789abcdef";

	var getRandomNumber = function(highestPosition) {
		return Math.floor((Math.random() * highestPosition) + 1)
	};

	var getRandomColor = function() {
		return colorPallette[getRandomNumber(colorPallette.length) - 1]
	};

	var getRandomColor2 = function() {
		var r, g, b;

		r = getRandomColorPart();
		g = getRandomColorPart();
		b = getRandomColorPart();

		return "#" + r + g + b;
	};

	var getRandomColorPart = function() {
		var pos, colorPart;

		colorPart = "";
		pos = getRandomNumber(hexDigits.length) - 1;
		colorPart += hexDigits[pos];
		pos = getRandomNumber(hexDigits.length) - 1;
		colorPart += hexDigits[pos];

		return colorPart;
	};

	var PatternGenerator1 = function(_cellWidth, _cellHeight) {
		var NUMBER_OF_STRIPES = 15;
		var MAX_SHORT_SIDE_LENGTH = 3;

		this.init = function(_cellWidth, _cellHeight) {
			this.cellWidth = _cellWidth;
			this.cellHeight = _cellHeight;
		};

		this.createPattern = function() {
			var stripes;

			stripes = [];
			for (var i = 1; i <= NUMBER_OF_STRIPES; i++) {
				stripes[stripes.length] = this.createStripeSpec();
			}

			return stripes;
		};

		this.createStripeSpec = function() {
			var x1, y1, x2, y2,
				top, left, bottom, right,
				shortSideLength;

			// get 2 random points
			x1 = getRandomNumber(this.cellWidth) - 1;
			y1 = getRandomNumber(this.cellHeight) - 1;
			x2 = getRandomNumber(this.cellWidth) - 1;
			y2 = getRandomNumber(this.cellHeight) - 1;

			// convert points to top/left bottom/right
			top = Math.min(y1, y2);
			left = Math.min(x1, x2);
			bottom = Math.max(y1, y2);
			right = Math.max(x1, x2);

			// shorten height or width to turn into stripe
			shortSideLength = getRandomNumber(MAX_SHORT_SIDE_LENGTH);
			if (getRandomNumber(2) == 1) {
				bottom = top + shortSideLength - 1;
				bottom = Math.min(bottom, this.cellHeight - 1);
			}
			else {
				right = left + shortSideLength - 1;
				right = Math.min(right, this.cellWidth - 1);
			}

			return {x: left, y: top, width: (right - left + 1), height: (bottom - top + 1), color: getRandomColor()};
		};

		this.changeStripeSpecColor = function(spec) {
			spec.color = getRandomColor();
		};

		this.changeStripeSpecDimensions = function(spec) {
			var tmpSpec;

			tmpSpec = this.createStripeSpec();
			spec.x = tmpSpec.x;
			spec.y = tmpSpec.y;
			spec.width = tmpSpec.width;
			spec.height = tmpSpec.height;
		};

		this.getNumOfPossibleDimensions = function() {
			var numOfVerticalStripeDimensions,
				numOfHorizontalStripeDimensions;

			numOfVerticalStripeDimensions = (this.cellHeight * (this.cellHeight + 1) / 2) * 3;
			numOfHorizontalStripeDimensions = (this.cellWidth * (this.cellWidth + 1) / 2) * 3;

			return (numOfVerticalStripeDimensions + numOfHorizontalStripeDimensions) * NUMBER_OF_STRIPES;
		};

		this.init(_cellWidth, _cellHeight);
	};


	var PatternGenerator2 = function(_cellWidth, _cellHeight) {
		var NUMBER_OF_STRIPES = 28;

		this.init = function(_cellWidth, _cellHeight) {
			this.cellWidth = _cellWidth;
			this.cellHeight = _cellHeight;
		};

		this.createPattern = function() {
			var stripes;

			stripes = [];
			for (var i = 1; i <= NUMBER_OF_STRIPES; i++) {
				stripes[stripes.length] = this.createStripeSpec(i);
			}

			return stripes;
		};

		this.createStripeSpec = function(y) {
			var x1,
				x2;

			x1 = getRandomNumber(this.cellWidth - 2);
			x2 = getRandomNumber(this.cellWidth - 2);

			return {x: Math.min(x1, x2), y: y, width: Math.abs(x1 - x2) + 1, height: 1, color: getRandomColor()};
		};

		this.changeStripeSpecColor = function(spec) {
			spec.color = getRandomColor();
		};

		this.changeStripeSpecDimensions = function(spec) {
			var tmpSpec;

			tmpSpec = this.createStripeSpec(spec.y);
			spec.x = tmpSpec.x;
			spec.width = tmpSpec.width;
		};

		this.getNumOfPossibleDimensions = function() {
			return (this.cellWidth - 2) * (this.cellHeight - 2) * NUMBER_OF_STRIPES / 2;
		};

		this.init(_cellWidth, _cellHeight);
	};


	var ColorMap = function(_width, _height) {
		var DEFAULT_BACKGROUND_COLOR = "#ffffff";

		this.init = function(_width, _height) {
			this.width = _width;
			this.height = _height;
			this.compareToCache = {};

			this.map = new Array(this.width * this.height);
			for (var i = 0; i < this.map.length; i++) {
				this.map[i] = DEFAULT_BACKGROUND_COLOR;
			}
		};

		this.addStripeToColorMap = function(spec) {
			var newx, newy;

			for (var i = 0; i < spec.width; i++) {
				for (var j = 0; j < spec.height; j++) {
					newx = spec.x + i;
					newy = spec.y + j;
					this.map[newx * this.width + newy] = spec.color;
				}
			}
		};

		this.getColorAt = function(x, y) {
			return this.map[(x * this.width) + y];
		};

		this.compareTo = function(color) {
			var count,
				avg,
				diff;

			if (this.compareToCache[color] == undefined) {
				count = 0;
				avg = 0
				for (var i = 0; i < this.map.length; i++) {
					diff = this.compareColors(color, this.map[i]);
					count++;
					diff -= avg;
					avg += (diff / count);
				}

				this.compareToCache[color] = avg;
			}

			return this.compareToCache[color];
		};

		this.compareColors = function(color1, color2) {
			var redDiff,
				greenDiff,
				blueDiff;

			redDiff = parseInt(color1.substring(1, 2), 16) - parseInt(color2.substring(1, 2), 16);
			greenDiff = parseInt(color1.substring(3, 4), 16) - parseInt(color2.substring(3, 4), 16);
			blueDiff = parseInt(color1.substring(5, 6), 16) - parseInt(color2.substring(5, 6), 16);

			return Math.abs(redDiff) + Math.abs(greenDiff) + Math.abs(blueDiff);
		};

		this.init(_width, _height);
	};

	module.getRandomNumber = getRandomNumber;
	module.getRandomColor = getRandomColor;
	module.PatternGenerator1 = PatternGenerator1;
	module.PatternGenerator2 = PatternGenerator2;
	module.ColorMap = ColorMap;

	return module;
}(CDE || {}));
