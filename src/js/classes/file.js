
class File {

	constructor(file) {
		// save reference to original FS file
		this._file = file;
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
		}
	}

	get pdf() {
		return this._pdf;
	}

	set bodyEl(el) {
		this._el = el;
	}

	get bodyEl() {
		return this._el;
	}
}