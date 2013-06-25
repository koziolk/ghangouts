(function(window) {
	"use strict";

	var client = new $.RestClient("http://gwiz.gene.com/peeps-search/");

	function HangoutDemo() {
		console.log("Starting...");

		gapi.hangout.onApiReady.add(this.onApiReady.bind(this));
	}

	HangoutDemo.prototype.onApiReady = function(event) {
		if (event.isApiReady === true) {
			console.log("API Ready");

			gapi.hangout.onParticipantsChanged.add(this.onParticipantsChanged
					.bind(this));

			document.getElementById("clickme").onclick = (this.buttonClick
					.bind(this));

			gapi.hangout.data.onStateChanged.add(this.displayCount.bind(this));

			this.displayCount();
			this.displayParticipants();
		}
	};

	HangoutDemo.prototype.buttonClick = function() {
		var value = gapi.hangout.data.getValue("count") || "0";
		value = (parseInt(value, 10) + 1).toString();
		gapi.hangout.data.setValue("count", value);
	};

	HangoutDemo.prototype.displayCount = function(event) {
		var value = gapi.hangout.data.getValue("count") || "0";
		document.getElementById("count").innerHTML = value;
	};

	HangoutDemo.prototype.onParticipantsChanged = function(event) {
		var div = document.getElementById("container");
		div.innerHTML = "";
		this.displayParticipants();
	};

	HangoutDemo.prototype.displayParticipants = function() {
		var div, participants, ul, li, i, l;
		participants = gapi.hangout.getParticipants();
		ul = document.createElement("ul");
		l = participants.length;
		for (i = 0; i < l; i++) {
			li = document.createElement("li");
			if (participants[i].person) {

				var displayName = participants[i].person.displayName;

				console.log("Before calling REST for person " + displayName);

				// call REST service
				client.add("contact");

				client.contact.read(displayName).done(function(data) {
					console.log(data);
				});
				
				console.log("After calling REST for person " + displayName);
				
				li.innerHTML = displayName;
			} else {
				li.innerHTML = "unknown";
			}
			ul.appendChild(li);
		}
		div = document.getElementById("container");
		div.appendChild(ul);
	};

	var hangoutDemo = new HangoutDemo();

}(window));