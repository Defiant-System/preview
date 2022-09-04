
// preview.spawn.contentView

{
	init() {
		
	},
	async dispatch(event) {
		let APP = preview,
			Self = APP.spawn.contentView,
			Spawn = event.spawn,
			File = event.file,
			page,
			pages,
			pageWidth,
			top,
			el;
		switch (event.type) {
			// system events
			case "spawn.blur":
				break;
			case "spawn.focus":
				// let active = Spawn.data.tabs._active.file;
				// // fast references
				// Self.els = {
				// 	page: active.bodyEl.find("contentView"),
				// };

				// console.log( Spawn.data.tabs._active );
				break;
			// native events
			case "scroll":
				break;
			// custom events
			case "init-file":
				// render sidebar thumbnails
				APP.spawn.sidebar.dispatch({ ...event, type: "render-thumbnails" });

				Self.dispatch({ ...event, type: "render-page", pageNum: 1 });

				page = File.bodyEl.find(".page:first");
				pages = Array.from({length: File.pdf.numPages - 1});
				pages.map(p => {
					let clone = page.after(page.clone(true)).addClass("loading");
					clone.append(`<svg><use href="#preview-svg-loading"></use></svg>`);
					clone.find("> div").html("");
				});

				// save reference to all pages
				File.pages = File.bodyEl.find(".page");

				console.log( File.pages );

				break;
			case "render-page":
				pageWidth = File.bodyEl.prop("offsetWidth") - 26;
				page = await File.pdf.getPage(event.pageNum);

				let viewport = page.getViewport({ scale: pageWidth / page.getViewport({ scale: 1 }).width });
				let pageEl = File.bodyEl.find(".page:first");
				el = pageEl.find("canvas");
				el.prop({ width: viewport.width, height: viewport.height })
					.css({ width: viewport.width, height: viewport.height });
				let canvasContext = el[0].getContext("2d");
				// Render PDF page into canvas context
				page.render({ canvasContext, viewport });

				// the text layer
				let textContent = await page.getTextContent();
				let container = pageEl.find("> div")[0];
				PDF.renderTextLayer({ textContent, viewport, container });
				break;
			case "content-zoom-reset":
			case "content-zoom-out":
			case "content-zoom-in":
				File = Spawn.data.tabs._active.file;

				pageWidth *= (event.type === "content-zoom-out") ? 0.8 : 1.25;
				if (event.type === "content-zoom-reset") {
					pageWidth = File.bodyEl.prop("offsetWidth") - 26;
				}

				/*
				this.pages.find("> div").html("");
				
				this.pages.map(async (pageEl, index) => {
					if (~pageEl.className.indexOf("loading")) return;

					// Fetch the page
					let page = await Self.file.getPage(index+1);
					let viewport = page.getViewport({ scale: pageWidth / page.getViewport({ scale: 1 }).width });

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
				*/
				break;
		}
	}
}
