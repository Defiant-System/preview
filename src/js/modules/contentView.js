
// preview.spawn.contentView

{
	init() {
		
	},
	async dispatch(event) {
		let APP = preview,
			Self = APP.spawn.contentView,
			Spawn = event.spawn,
			File = event.file || Self.file,
			page,
			el;
		switch (event.type) {
			// system events
			case "spawn.blur":
			case "spawn.focus":
				break;
			// custom events
			case "init-file":
				// render sidebar thumbnails
				APP.spawn.sidebar.dispatch({ ...event, type: "render-thumbnails" });

				// page template element
				page = File.bodyEl.find(".page:first");

				// page widths - used for zoom in/out
				let width = page.prop("offsetWidth") || (Spawn || File.spawn).innerWidth - 26;
				File.zoom = { reset: width, width };

				// render page contents
				[...Array(File.pdf.numPages)].map((e, i) => {
					let el = page.before(page.clone(true)),
						pageNum = i + 1;
					Self.dispatch({ ...event, type: "render-page", pageNum, el });
				});
				// remove reference element
				page.remove();
				// reference to file
				// Self.file = File;
				break;
			case "scroll-to-page":
				let top = File.bodyEl.find(".page").nth(event.pageNum).prop("offsetTop");
				Self.suppressEventLoop = top - 10;
				File.bodyEl.find("content").scrollTop(Self.suppressEventLoop);
				break;
			case "render-page":
				page = await File.pdf.getPage(event.pageNum);

				let viewport = page.getViewport({ scale: File.zoom.width / page.getViewport({ scale: 1 }).width });
				el = event.el.find("canvas");
				el.prop({ width: viewport.width, height: viewport.height })
					.css({ width: viewport.width, height: viewport.height });
				let canvasContext = el[0].getContext("2d");
				// Render PDF page into canvas context
				page.render({ canvasContext, viewport });

				// the text layer
				let textContent = await page.getTextContent();
				let container = event.el.find("> div")[0];
				// PDF.renderTextLayer({ textContent, viewport, container });
				break;
			case "content-zoom-reset":
			case "content-zoom-out":
			case "content-zoom-in":
				File = Spawn.data.tabs._active.file;

				File.zoom.width *= (event.type === "content-zoom-out") ? 0.8 : 1.25;
				if (event.type === "content-zoom-reset") {
					File.zoom.width = File.zoom.reset;
				}
				File.zoom.width = Math.round(File.zoom.width);

				File.bodyEl.find(".page").map((e, i) => {
					// re-render pages
					Self.dispatch({
						type: "render-page",
						file: File,
						pageNum: i + 1,
						el: $(e),
					});
				});
				break;
		}
	}
}
