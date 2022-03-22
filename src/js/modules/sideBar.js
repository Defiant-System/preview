
// preview.sidebar

{
	init() {
		this.toc = window.find("sidebar > .toc");
		this.thumbWidth = this.toc.prop("offsetWidth") * 0.73;
		this.selectedPage = 0;
	},
	async dispatch(event) {
		let APP = preview,
			Self = APP.sidebar,
			contentView = APP.contentView,
			selectedPage,
			el,
			pEl,
			isOn;
		switch (event.type) {
			case "toggle-sidebar-view":
				pEl = this.toc.parents("sidebar");
				isOn = pEl.hasClass("hidden");
				pEl.toggleClass("hidden", isOn);
				return isOn;
			case "sidebar-select-thumbnail":
				el = $(event.target);
				if (!el.hasClass("thumb")) return;
				el.parent().find(".selected").removeClass("selected");
				el.addClass("selected");

				selectedPage = el.index();
				contentView.dispatch({type: "scroll-to-page", pageNum: selectedPage});
				break;
			case "update-active-page":
				if (event.pageNum === Self.selectedPage) return;
				this.toc.find(".selected").removeClass("selected");

				this.toc.find(`.thumb:nth-child(${event.pageNum + 1})`).addClass("selected");
				Self.selectedPage = event.pageNum;
				break;
			case "render-thumbnails":
				let pdf = event.pdf;
				let pages = Array.from({length: pdf.numPages});
				let thumbnails = await Promise.all(pages.map(async (n, i) => {
					let className = i === 0 ? "thumb selected" : "thumb";
					let page = await pdf.getPage(i+1);
					let viewport = page.getViewport({ scale: 0.5 });

					// Prepare canvas using PDF page dimensions
					let cvs = document.createElement("canvas");
					let canvasContext = cvs.getContext("2d");
					cvs.height = viewport.height;
					cvs.width = viewport.width;

					let pHeight = this.thumbWidth / (viewport.width / viewport.height);

					// Render PDF page into canvas context
					await page.render({ canvasContext, viewport }).promise;

					return `<div class="${className}" style="height: ${pHeight}px;" data-page-number="${i+1}">
								<img src="${cvs.toDataURL()}"/>
							</div>`;
				}));
				this.toc.append(thumbnails.join(""));
				break;
		}
	}
}
