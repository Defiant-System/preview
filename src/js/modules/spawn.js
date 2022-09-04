
// preview.spawn

{
	init() {
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init());
	},
	dispatch(event) {
		let APP = preview,
			Self = APP.spawn,
			Spawn = event.spawn,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "spawn.open":
				Spawn.data.tabs = new Tabs(Self, Spawn);
				// init blank view
				Self.blankView.dispatch({ ...event, type: "init-blank-view" });

				// Spawn.find("layout").addClass("show-blank-view");

				// temp
				// setTimeout(() => Self.dispatch({ type: "tab.new", spawn: Spawn }), 300);
				break;
			case "spawn.init":
				Self.dispatch({ ...event, type: "tab.new" });
				break;
			case "spawn.blur":
			case "spawn.focus":
				// forward event to all sub-objects
				Object.keys(Self)
					.filter(i => typeof Self[i].dispatch === "function")
					.map(i => Self[i].dispatch(event));
				break;
			case "open.file":
				(event.files || [event]).map(async fHandle => {
					let file = await fHandle.open({ responseType: "arrayBuffer" });
					// auto add first base "tab"
					Self.dispatch({ type: "tab.new", spawn: Spawn, file });
				});
				break;

			// tab related events
			case "tab.new":
				// add "file" to tab row
				Spawn.data.tabs.add(event.file);
				break;
			case "tab.clicked":
				Spawn.data.tabs.focus(event.el.data("id"));
				break;
			case "tab.close":
				Spawn.data.tabs.remove(event.el.data("id"));
				break;

			// custom events
			case "open-file":
				Spawn.dialog.open({ pdf: item => Self.dispatch(item) });
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			
			default:
				if (event.el) {
					let pEl = event.el.parents(`div[data-area]`);
					if (pEl.length) {
						let name = pEl.data("area");
						Self[name].dispatch(event);
					}
				}
			
		}
	},
	blankView:   @import "./blankView.js",
	contentView: @import "./contentView.js",
	sidebar:     @import "./sidebar.js",
}