
class Tabs {
	constructor(parent, spawn) {
		this._parent = parent;
		this._spawn = spawn;
		this._stack = {};
		this._active = null;

		// DOM template
		let template = spawn.find(".file");
		this._content = spawn.find("layout");
		this._template = template.clone(true);
		template.remove();
	}

	get file() {
		return this._active.file;
	}

	get length() {
		return Object.keys(this._stack).length;
	}

	add(fsItem) {
		let tId = "f"+ Date.now(),
			file = new File(fsItem),
			tabEl = this._spawn.tabs.add(fsItem.base, tId),
			bodyEl = this._template.clone(true);

		// add element to DOM + append file contents
		bodyEl.attr({ "data-id": tId });
		bodyEl = this._content.append(bodyEl);
		// attach DOM element to file wrapper
		file.bodyEl = bodyEl;

		// save reference to tab
		this._stack[tId] = { tId, tabEl, bodyEl, file };
		// focus on file
		this.focus(tId);
	}

	merge(ref) {
		
	}

	remove(tId) {
		// remove element from DOM tree
		this._stack[tId].bodyEl.remove();
		// delete references
		this._stack[tId] = false;
		delete this._stack[tId];
	}

	focus(tId) {
		let active = this._active;
		if (active) {
			// hide blurred body
			active.bodyEl.addClass("hidden");
		}
		// reference to active tab
		this._active = this._stack[tId];
		// UI update
		this.update();
	}

	update() {
		let spawn = this._spawn,
			active = this._active,
			value;
		// unhide focused body
		active.bodyEl.removeClass("hidden");
		// update spawn window title
		spawn.title = active.file._file.base;

		// fix toolbar
		value = true;
		spawn.find(`.toolbar-tool_[data-click="toggle-sidebar-view"]`).toggleClass("tool-disabled_", value);

		value = true;
		spawn.find(`.toolbar-tool_[data-click="content-zoom-out"]`).toggleClass("tool-disabled_", value);
		
		value = true;
		spawn.find(`.toolbar-tool_[data-click="content-zoom-in"]`).toggleClass("tool-disabled_", value);
	}

	openLocal(url) {
		let parts = url.slice(url.lastIndexOf("/") + 1),
			[ name, kind ] = parts.split("."),
			file = new karaqu.File({ name, kind });
		// return promise
		return new Promise((resolve, reject) => {
			// fetch image and transform it to a "fake" file
			window.fetch(url, { responseType: "arrayBuffer" })
				.then(f => {
					file.size = f.size;
					file.arrayBuffer = f.arrayBuffer;
					resolve(file);
				})
				.catch(err => reject(err));
		});
	}
}
