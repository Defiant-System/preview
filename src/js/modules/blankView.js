
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

		setTimeout(() => {
			this.els.el.find(".sample:nth(0)").trigger("click");
		}, 700);
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
					.then(file => {
						// forward event to app
						APP.dispatch({ type: "open.file", file });
					});
				break;
		}
	}
}