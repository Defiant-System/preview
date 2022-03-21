
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
	},
	dispatch(event) {
		let APP = preview,
			Self = APP.blankView,
			file,
			name,
			value,
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
				console.log( el );
				// opening image file from application package
				// Files.openLocal(el.data("url"))
				// 	.then(file => {
				// 		// forward event to app
				// 		APP.dispatch({ type: "prepare-file", isSample: true, file })
				// 	});
				break;
		}
	}
}