
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
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "spawn.open":
				Spawn.data.tabs = new Tabs(Self, Spawn);
				// init blank view
				Self.blankView.dispatch({ ...event, type: "init-blank-view" });

				// temp
				// setTimeout(() => Self.dispatch({ type: "tab.new", spawn: Spawn }), 300);
				// setTimeout(() => Spawn.find(`.toolbar-tool_[data-click="toggle-sidebar-view"]`).trigger("click"), 500);
				// setTimeout(() => {
				// 	if (Spawn.find("layout.show-blank-view").length) return;
				// 	Self.dispatch({ ...event, type: "merge-all-windows" });
				// }, 800);
				break;
			case "spawn.init":
				Self.dispatch({ ...event, type: "tab.new" });
				// switch lauout UI
				Spawn.find("layout").addClass("show-blank-view");
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
			case "load-samples":
				event.samples.map(async path => {
					let file = await Spawn.data.tabs.openLocal(`~/samples/${path}`);
					// auto add first base "tab"
					Self.dispatch({ ...event, file, type: "tab.new" });
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
			case "new-spawn":
				APP.dispatch({ type: "new-spawn" });
				break;
			case "open-file":
				Spawn.dialog.open({ pdf: item => Self.dispatch(item) });
				break;
			case "merge-all-windows":
				Spawn.siblings.map(oSpawn => {
					for (let key in oSpawn.data.tabs._stack) {
						let ref = oSpawn.data.tabs._stack[key];
						Spawn.data.tabs.merge(ref);
					}
					// close sibling spawn
					oSpawn.close();
				});
				break;
			case "close-tab":
				value = Spawn.data.tabs.length;
				if (event.delayed) {
					Spawn.data.tabs.removeDelayed();
				} else if (value > 1) {
					Spawn.data.tabs._active.tabEl.find(`[sys-click]`).trigger("click");
				} else if (value === 1) {
					Self.dispatch({ ...event, type: "close-spawn" });
				}
				break;
			case "close-spawn":
				// system close window / spawn
				karaqu.shell("win -c");
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;

			// proxy toolbar events
			case "content-zoom-out":
			case "content-zoom-in":
			case "content-zoom-reset":
				return Self.contentView.dispatch(event);
			case "toggle-sidebar-view":
				return Self.sidebar.dispatch(event);
			
			default:
				if (event.el) {
					let pEl = event.el.parents("[data-area]");
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