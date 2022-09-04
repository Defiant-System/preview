
class File {

	constructor(file) {
		// save reference to original FS file
		this._file = file;
		// in the future, this app will support other file types than PDF
		switch (this._file.kind) {
			case "pdf":
				PDF.getDocument({ data: file.arrayBuffer }).promise.then(pdf => {
					// reset DOM element
					this._el.removeClass("loading").find("svg").remove();

					// console.log(pdf);
				});
				break;
		}
	}

	set bodyEl(el) {
		this._el = el;
	}

}
