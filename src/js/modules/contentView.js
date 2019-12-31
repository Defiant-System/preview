
// let pdfjsLib = defiant.import("./modules/pdf.min.js")
// pdfjsLib.GlobalWorkerOptions.workerSrc = "~/workers/pdf.worker.min.js";

//console.log(pdfjsLib.AnnotationLayer);

let preview;
let sidebar;
let pdf;

let contentView = {
	init(_preview, _sidebar) {
		// fast and direct references
		preview = _preview;
		sidebar = _sidebar;

		this.content = window.find("content");
		this.page = this.content.find(".page:first");
		this.zoomReset =
		this.pageWidth = this.page.prop("offsetWidth");

		// bind event handlers
		this.content.on("scroll", this.dispatch.bind(this));
	},
	async dispatch(event) {
		let el,
			text,
			page,
			viewport,
			canvas,
			canvasContext,
			textContent,
			top;
		switch (event.type) {
			// native events
			case "scroll":
				let pageNum = 0,
					t2;

				top = event.target.scrollTop + event.target.offsetHeight;
				t2 = top - (event.target.offsetHeight / 2);

				this.pages.map((page, index) => {
					if (t2 > page.offsetTop) {
						pageNum = index;
					}
					if (index > 0 && ~page.className.indexOf("loading") && top > page.offsetTop) {
						page.classList.remove("loading");
						this.dispatch({
							type: "render-page",
							pageNum: index + 1,
							page
						});
					}
				});
				if (this.suppressEventLoop && this.suppressEventLoop !== event.target.scrollTop) return;
				delete this.suppressEventLoop;
				sidebar.dispatch({type: "update-active-page", pageNum});
				break;
			// custom events
			case "scroll-to-page":
				top = this.pages.nth(event.pageNum).prop("offsetTop");
				this.suppressEventLoop = top - 10;
				this.content.scrollTop(this.suppressEventLoop);
				break;
			case "open.file":
				let file = await event.open(),
					data = file.text;
				pdf = await pdfjsLib.getDocument({ data }).promise;

				// clear all but one page
				this.page.nextAll(".page").remove();

				// render sidebar thumbnails
				sidebar.dispatch({type: "render-thumbnails", pdf});
				
				// render first page
				await this.dispatch({
					type: "render-page",
					page: this.page[0],
					pageNum: 1
				});

				let pages = Array.from({length: pdf.numPages - 1});
				pages.map(p => {
					let clone = this.page.after(this.page.clone("true")).addClass("loading");
					clone.append(`<svg><use href="#preview-svg-loading"></use></svg>`);
					clone.find("> div").html("");
				});

				// save reference to all pages
				this.pages = this.content.find(".page");

				// trigger scroll event to check if other pages are in view => rendering
				this.content.trigger("scroll");

				//this.dispatch({type: "content-zoom-out", page: this.page[0], pageNum: 1});
				break;
			case "render-page":
				// Fetch the page
				page = await pdf.getPage(event.pageNum);
				viewport = page.getViewport({ scale: this.pageWidth / page.getViewport({scale: 1}).width });

				// Prepare canvas using PDF page dimensions
				canvas = event.page.getElementsByTagName("canvas")[0]
				canvasContext = canvas.getContext("2d");
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				canvas.style.height = viewport.height + "px";
				canvas.style.width = viewport.width + "px";

				// Render PDF page into canvas context
				page.render({ canvasContext, viewport });

				// the text layer
				textContent = await page.getTextContent();
				pdfjsLib.renderTextLayer({
					textContent,
					viewport,
					container: event.page.getElementsByTagName("div")[0],
				});
				break;
			case "content-zoom-reset":
			case "content-zoom-out":
			case "content-zoom-in":
				this.pageWidth *= (event.type === "content-zoom-out") ? 0.8 : 1.25;
				if (event.type === "content-zoom-reset") {
					this.pageWidth = this.zoomReset;
				}

				this.pages.find("> div").html("");
				
				this.pages.map(async (pageEl, index) => {
					if (~pageEl.className.indexOf("loading")) return;

					// Fetch the page
					page = await pdf.getPage(index+1);
					viewport = page.getViewport({ scale: this.pageWidth / page.getViewport({scale: 1}).width });

					// Prepare canvas using PDF page dimensions
					canvas = pageEl.getElementsByTagName("canvas")[0]
					canvasContext = canvas.getContext("2d");
					canvas.height = viewport.height;
					canvas.width = viewport.width;

					canvas.style.height = viewport.height + "px";
					canvas.style.width = viewport.width + "px";

					// Render PDF page into canvas context
					page.render({ canvasContext, viewport });
				});
				break;
		}
	}
};

export default contentView;
