var CDE = (function(module) {
	var regColorCode = /^#([0-9a-fA-F]{6})$/;

	var ControlPanel = function(_house, _assassin) {
		var self = this;

		this.init = function() {
			this.house = _house;
			this.assassin = _assassin;
			this.createControlElement();

			this.controlElement.find("input.dog-count").val(this.house.occupiedCells.length);
			this.controlElement.find("input.mutation-count").val(this.house.mutations.length);
			this.controlElement.find("input.background-color").val(this.house.backgroundColor);
			this.drawMutationDirection();

			this.controlElement.find("#btnToggleHouseLight").bind("click", this.toggleHouseLight);
			this.controlElement.find("#btnChangeBackgroundColor").bind("click", this.changeBgColor);
			this.house.controlElement.bind("dogAdded", this.dogAdded);
			this.house.controlElement.bind("dogRemoved", this.dogRemoved);
			this.house.controlElement.bind("dogMutated", this.dogMutated);
		};

		this.dogAdded = function(e) {
			self.controlElement.find("input.dog-count").val(e.dogCount);
		};

		this.dogRemoved = function(e) {
			self.controlElement.find("input.dog-count").val(e.dogCount);
		};

		this.dogMutated = function(e) {
			var lastMutation;

			self.controlElement.find(".sectionLatestMutation").show();
			self.showMutation(e.before, "before");
			self.showMutation(e.after, "after");
			lastMutation = self.house.mutations[self.house.mutations.length - 1];
			self.controlElement.find("textarea.latest-mutation").val(lastMutation.name + ":\nold -> " + lastMutation.oldVal + "\nnew -> " + lastMutation.newVal);
			self.controlElement.find("input.mutation-count").val(self.house.mutations.length);
		};

		this.showMutation = function(dog, canvasName) {
			var colorMap,
				ctx;

			colorMap = dog.getColorMap();
			ctx = this.controlElement.find("." + canvasName)[0].getContext("2d");
			for (var y = 0; y < 30; y++) {
				for (var x = 0; x < 30; x++) {
					ctx.fillStyle = colorMap.getColorAt(x, y);
					ctx.fillRect(x * 5, y * 5, 5, 5);
				}
			}
		};

		this.drawMutationDirection = function() {
			var ctx;

			ctx = this.controlElement.find(".mutation-direction")[0].getContext("2d");
			ctx.fillStyle = "#669933";
			ctx.strokeStyle = "#669933";
			ctx.lineWidth = 1;

			ctx.fillRect(65, 0, 20, 20);

			ctx.beginPath();
			ctx.moveTo(55, 11);
			ctx.lineTo(75, 29);
			ctx.lineTo(94, 11);
			ctx.lineTo(55, 11);
			ctx.stroke();
			ctx.fill();
			ctx.closePath();
		};

		this.toggleHouseLight = function(e) {
			if (self.house.lightsOn == false) {
				self.controlElement.find("#btnToggleHouseLight").text("lights off");
				self.house.turnLightsOn();
				for (var i = 0; i < self.house.occupiedCells.length; i++) {
					self.house.getDog(self.house.occupiedCells[i]).comeAlive();
				}
				self.assassin.comeAlive();
			}
			else {
				self.controlElement.find("#btnToggleHouseLight").text("lights on");
				self.house.turnLightsOff();
			}
		};

		this.changeBgColor = function(e) {
			var bgColor;

			bgColor = $.trim(self.controlElement.find("input.background-color").val());
			if (regColorCode.test(bgColor) == true) {
				self.house.setBackgroundColor(bgColor);
			}
			else {
				alert("Invalid entry for background color");
			}
		};

		this.createControlElement = function() {
			this.controlElement = $(this.toHTML());
		};

		this.toHTML = function() {
			var html;

			html = '<div class="control-panel">';
			html += '  <button id="btnToggleHouseLight">lights on</button>';
			html += '  <br><br>';
			html += '  Dog Count:';
			html += '  <br>';
			html += '  <input type="text" class="dog-count">';
			html += '  <br><br>';
			html += '  Mutation Count:';
			html += '  <br>';
			html += '  <input type="text" class="mutation-count">';
			html += '  <br><br>';
			html += '  BG Color:';
			html += '  <br>';
			html += '  <input type="text" class="background-color">';
			html += '  <br>';
			html += '  <button id="btnChangeBackgroundColor">change</button>';
			html += '  <br><br>';
			html += '  <div class="sectionLatestMutation" style="display: none;">';
			html += '    Latest Mutation:';
			html += '    <br>';
			html += '    <canvas class="before" width="150" height="150"></canvas>';
			html += '    <br>';
			html += '    <canvas class="mutation-direction" width="150" height="30"></canvas>';
			html += '    <br>';
			html += '    <canvas class="after" width="150" height="150"></canvas>';
			html += '    <br>';
			html += '    <textarea class="latest-mutation" rows="3" cols="20"></textarea>';
			html += '  </div>';
			html += '</div>';

			return html;
		};

		this.init();
	};

	module.ControlPanel = ControlPanel;

	return module;
}(CDE || {}));
