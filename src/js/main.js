
import sideBar from "./modules/sideBar"
import contentView from "./modules/contentView"

const preview = {
	init() {
		sideBar.init(preview, contentView);
		contentView.init(preview, sideBar);
	},
	async dispatch(event) {
		let data,
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
				return contentView.dispatch(data || event);
			case "toggle-sidebar-view":
			case "sidebar-select-thumbnail":
				return sideBar.dispatch(event);
		}
	}
};

window.exports = preview;
