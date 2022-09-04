
class Tabs {
	constructor(parent, spawn) {
		this._parent = parent;
		this._spawn = spawn;
		this._stack = {};
		this._active = null;
	}

	get file() {
		return this._active.file;
	}

	get length() {
		return Object.keys(this._stack).length;
	}

	add(fItem) {
		// let file = fItem || new File();
		let file = fItem || { base: "Blank" },
			tId = "f"+ Date.now(),
			tName = file ? file.base : "Blank",
			tabEl = this._spawn.tabs.add(tName, tId),
			bodyEl = this._template.clone(),
			history = new window.History,
			sidebar = false;

		// add element to DOM + append file contents
		bodyEl.attr({ "data-id": tId });
		bodyEl = this._content.append(bodyEl);

		if (file._file) file.bodyEl = bodyEl;

		// save reference to tab
		this._stack[tId] = { tId, tabEl, bodyEl, history, file, sidebar };
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
		
	}

	update() {
		
	}
}
