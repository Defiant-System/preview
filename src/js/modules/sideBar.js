
// preview.sidebar

{
	init() {
		
	},
	async dispatch(event) {
		let APP = preview,
			Self = APP.spawn.sidebar,
			Spawn = event.spawn,
			File = event.file,
			el,
			pEl,
			isOn;
		switch (event.type) {
			// system events
			case "spawn.blur":
			case "spawn.focus":
				break;
			// custom events
			case "toggle-sidebar-view":
				pEl = Spawn.data.tabs._active.bodyEl.find("sideBar");
				isOn = pEl.hasClass("hidden");
				pEl.toggleClass("hidden", isOn);

				let active = Spawn.data.tabs._active;
				active.sidebar = isOn;

				return isOn;
			case "sidebar-select-thumbnail":
				el = $(event.target);
				if (!el.hasClass("thumb")) return;
				el.parent().find(".selected").removeClass("selected");
				el.addClass("selected");

				APP.spawn.contentView.dispatch({
					type: "scroll-to-page",
					pageNum: el.index(),
				});
				break;
			case "render-thumbnails":
				let toc = File.bodyEl.find(`sidebar > .toc`);
				let thumbWidth = toc.prop("offsetWidth") * 0.73;
				let pages = [...Array(File.pdf.numPages)];
				let thumbnails = await Promise.all(pages.map(async (n, i) => {
					let className = i === 0 ? "thumb selected" : "thumb",
						page = await File.pdf.getPage(i+1),
						viewport = page.getViewport({ scale: 0.5 }),
						pHeight = Math.round(thumbWidth / (viewport.width / viewport.height));

					// Prepare canvas using PDF page dimensions
					let cvs = document.createElement("canvas");
					let canvasContext = cvs.getContext("2d");
					cvs.height = viewport.height;
					cvs.width = viewport.width;

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
