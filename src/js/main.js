
@import "classes/tabs.js"


const preview = {
	init() {
		
	},
	async dispatch(event) {
		let Self = preview,
			spawn,
			el;
		// proxy spawn events
		if (event.spawn) return Self.spawn.dispatch(event);

		switch (event.type) {
			// system events
			case "window.init":
				break;
			case "open.file":
				spawn = window.open("spawn");
				Self.spawn.dispatch({ ...event, spawn });
				break;
		}
	},
	spawn: @import "modules/spawn.js",
};

window.exports = preview;
