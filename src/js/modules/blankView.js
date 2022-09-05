
// preview.spawn.blankView

{
	init() {
		
	},
	dispatch(event) {
		let APP = preview,
			Spawn = event.spawn,
			Self = APP.spawn.blankView,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-blank-view":
				// blank view
				el = Spawn.find(".blank-view");
				if (!el.find(".div").length) {
					// render blank view
					window.render({
						template: "blank-view",
						match: `//Data`,
						target: el,
					});
				}
				break;
			case "open-filesystem":
				APP.spawn.dispatch({ ...event, type: "open-file" });
				break;
			case "from-clipboard":
				// TODO
				break;
			case "select-sample":
				el = $(event.target);
				if (!el.hasClass("sample")) return;

				// close "current tab"
				APP.spawn.dispatch({ type: "close-tab", spawn: Spawn, delayed: true });

				let url = el.data("url"),
					parts = url.slice(url.lastIndexOf("/") + 1),
					[ name, kind ] = parts.split("."),
					file = new karaqu.File({ name, kind });
				// fetch file
				window.fetch(url, { responseType: "arrayBuffer" })
					// forward event to app
					.then(file => {
						// auto add first base "tab"
						APP.spawn.dispatch({ type: "tab.new", spawn: Spawn, file });
					});
				break;
		}
	}
}