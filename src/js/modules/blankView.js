
// preview.blankView

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			el: window.find(".blank-view"),
		};
		
		// render blank view
		window.render({
			template: "blank-view",
			match: `//Data`,
			target: preview.els.blankView
		});

		// temp
		// setTimeout(() => this.els.el.find(".sample:nth(1)").trigger("click"), 200);
		// setTimeout(() => preview.els.toolbar.sidebar.trigger("click"), 700);
	},
	dispatch(event) {
		let APP = preview,
			Self = APP.blankView,
			el;
		// console.log(event);
		switch (event.type) {
			case "open-filesystem":
				APP.dispatch({ type: "open-file" });
				break;
			case "from-clipboard":
				// TODO
				break;
			case "select-sample":
				el = $(event.target);
				if (!el.hasClass("sample")) return;

				let url = el.data("url"),
					parts = url.slice(url.lastIndexOf("/") + 1),
					[ name, kind ] = parts.split("."),
					file = new defiant.File({ name, kind });
				// fetch file
				window.fetch(url, { responseType: "arrayBuffer" })
					// forward event to app
					.then(file => APP.dispatch({ type: "open.file", file }));
				break;
		}
	}
}