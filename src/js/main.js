
import * as PDF from "./pdfjs/pdf.js"
PDF.GlobalWorkerOptions.workerSrc = "~/js/pdf.worker.js"


@import "classes/file.js"
@import "classes/tabs.js"
@import "modules/test.js"


const preview = {
	init() {
		
	},
	dispose(event) {
		if (event.spawn) {
			return this.spawn.dispose(event);
		}
	},
	async dispatch(event) {
		let Self = preview,
			spawn,
			el;
		// proxy spawn events
		if (event.spawn) return Self.spawn.dispatch(event);

		switch (event.type) {
			// system events
			case "new-spawn":
			case "window.init":
				spawn = window.open(event.id || "spawn");
				Self.spawn.dispatch({ ...event, type: "spawn.init", spawn });
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
