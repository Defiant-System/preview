
class File {

	constructor(file, spawn) {
		// save reference to original FS file
		this._file = file;
		this._spawn = spawn;
		// in the future, this app will support other file types than PDF
		switch (this._file.kind) {
			case "pdf":
				PDF.getDocument({ data: file.arrayBuffer }).promise.then(pdf => {
					// reference to PDF document
					this._pdf = pdf;
					// reset DOM element
					this._el.removeClass("loading").find("svg").remove();
					// initiate file in content view
					preview.spawn.contentView.dispatch({ type: "init-file", file: this });
				});
				break;
			default:
				// blank view
				spawn.find(".file.loading").removeClass("loading").addClass("hidden");
				spawn.find("layout").addClass("show-blank-view");
		}
	}

	get pdf() {
		return this._pdf;
	}

	get base() {
		return this._file.base;
	}

	get spawn() {
		return this._spawn;
	}

	set bodyEl(el) {
		this._el = el;
	}

	get bodyEl() {
		return this._el;
	}
}
