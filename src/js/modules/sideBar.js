
// preview.sidebar

{
	init() {
		
	},
	async dispatch(event) {
		let APP = preview,
			Self = APP.spawn.sidebar,
			File = event.file,
			isOn;
		switch (event.type) {
			case "spawn.blur":
			case "spawn.focus":
				break;
			case "render-thumbnails":
				let toc = File.bodyEl.find(`sidebar > .toc`);
				let thumbWidth = toc.prop("offsetWidth") * 0.73;
				let pages = Array.from({ length: File.pdf.numPages });
				let thumbnails = await Promise.all(pages.map(async (n, i) => {
					let className = i === 0 ? "thumb selected" : "thumb",
						page = await File.pdf.getPage(i+1),
						viewport = page.getViewport({ scale: 0.5 });

					// Prepare canvas using PDF page dimensions
					let cvs = document.createElement("canvas");
					let canvasContext = cvs.getContext("2d");
					cvs.height = viewport.height;
					cvs.width = viewport.width;

					let pHeight = thumbWidth / (viewport.width / viewport.height);

					// Render PDF page into canvas context
					await page.render({ canvasContext, viewport }).promise;

					return `<div class="${className}" style="height: ${pHeight}px;" data-page-number="${i+1}">
								<img src="${cvs.toDataURL()}"/>
							</div>`;
				}));
				toc.html(thumbnails.join(""));
				break;
		}
	}
}
