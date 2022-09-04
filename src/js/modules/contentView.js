
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
			pageWidth,
			viewport,
			top,
			cvs,
			ctx,
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
			case "render-page":
				page = await File.pdf.getPage(event.pageNum);
				pageWidth = File.bodyEl.prop("offsetWidth") - 26;
				viewport = page.getViewport({ scale: pageWidth / page.getViewport({scale: 1}).width });
				
				cvs = File.bodyEl.find(".page:first canvas");
				cvs.prop({ width: viewport.width, height: viewport.height })
					.css({ width: viewport.width, height: viewport.height });
				ctx = cvs[0].getContext("2d");
				break;
		}
	}
}
