
import * as PDF from "./pdfjs/pdf.js"
PDF.GlobalWorkerOptions.workerSrc = "~/pdf.worker.js"

const preview = {
	init() {
		this.sideBar.init();
		this.contentView.init(PDF);
	},
	async dispatch(event) {
		let self = preview,
			data,
			isOn;
		switch (event.type) {
			case "toggle-toolbar":
				isOn = window.el.hasClass("has_ToolBar");
				window.el.toggleClass("has_ToolBar", isOn);
				return isOn ? "toggle_true" : "toggle_false";
			case "open.file":
			case "content-toggle-lights":
			case "content-zoom-out":
			case "content-zoom-in":
			case "content-zoom-reset":
				return self.contentView.dispatch(data || event);
			case "toggle-sidebar-view":
			case "sidebar-select-thumbnail":
				return self.sideBar.dispatch(event);
		}
	},
	contentView: defiant.require("contentView.js"),
	sideBar:     defiant.require("sideBar.js")
};

window.exports = preview;
