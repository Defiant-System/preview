
import * as PDF from "./pdfjs/pdf.js"
PDF.GlobalWorkerOptions.workerSrc = "~/js/pdf.worker.js"

const preview = {
	init() {
		// fast references
		this.els = {
			layout: window.find("layout"),
			blankView: window.find(".blank-view"),
			toolbar: {
				sidebar: window.find(`.toolbar-tool_[data-click="toggle-sidebar-view"]`),
				zoomIn: window.find(`.toolbar-tool_[data-click="content-zoom-in"]`),
				zoomOut: window.find(`.toolbar-tool_[data-click="content-zoom-out"]`),
			}
		};
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(PDF));

		// setTimeout(() => this.dispatch({ type: "content-toggle-lights" }), 1500);
	},
	async dispatch(event) {
		let Self = preview,
			file,
			name,
			value,
			pEl,
			el;
		switch (event.type) {
			// system events
			case "window.init":
				// reset app by default - show initial view
				Self.dispatch({ type: "reset-app" });
				break;
			case "window.resize":
				// console.log(window.innerWidth);
				break;
			case "open.file":
				if (event.file) {
					Self.contentView.dispatch({ ...event, type: "open-file" });
				} else {
					// Files.open(event.path);
					event.open({ responseType: "arrayBuffer" })
						.then(file => Self.contentView.dispatch({ type: "open-file", file }));
				}
				break;
			// custom events
			case "open-file":
				window.dialog.open({ pdf: item => Self.dispatch(item) });
				break;
			case "close-file":
				// hide sidebar, if needed
				if (!Self.sidebar.el.hasClass("hidden")) {
					Self.els.toolbar.sidebar
						.prop({ className: "toolbar-tool_" })
						.trigger("click");
				}
				// enable tools & click on show sidebar
				Self.els.toolbar.zoomIn.addClass("tool-disabled_");
				Self.els.toolbar.zoomOut.addClass("tool-disabled_");
				Self.els.toolbar.sidebar.addClass("tool-disabled_");
				// show blank view
				Self.els.layout.addClass("show-blank-view");
				break;
			case "setup-workspace":
				// hide blank view
				Self.els.layout.removeClass("show-blank-view");
				// enable tools & click on show sidebar
				Self.els.toolbar.zoomIn.removeClass("tool-disabled_");
				Self.els.toolbar.zoomOut.removeClass("tool-disabled_");
				Self.els.toolbar.sidebar.removeClass("tool-disabled_");
				break;
			case "reset-app":
				// show blank view
				Self.els.layout.addClass("show-blank-view");
				break;
			case "toggle-toolbar":
				value = window.el.hasClass("has-ToolBar_");
				window.el.toggleClass("has-ToolBar_", value);
				return value ? "toggle_true" : "toggle_false";
			case "content-zoom-out":
			case "content-zoom-in":
			case "content-zoom-reset":
				return Self.contentView.dispatch(event);
			case "toggle-sidebar-view":
				return Self.sidebar.dispatch(event);
			default:
				if (event.el) {
					pEl = event.el.data("area") ? event.el : event.el.parents(`[data-area]`);
					if (pEl.length) {
						name = pEl.data("area");
						Self[name].dispatch(event);
					}
				}
		}
	},
	blankView:   @import "modules/blankView.js",
	contentView: @import "modules/contentView.js",
	sidebar:     @import "modules/sidebar.js",
};

window.exports = preview;
