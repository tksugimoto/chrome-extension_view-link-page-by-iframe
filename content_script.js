"use strict";

window.iframeUrlMap = new Map();

document.body.addEventListener("click", evt => {
	window.iframeUrlMap.forEach(iframe => {
		iframe.style.display = "none";
	});
});

chrome.runtime.onMessage.addListener(request => {
	if (request.method === "viewLinkPage") {
		var iframe,
			url = request.url,
			urlWithoutHash = url.replace(/#.*/, "");
		
		if (iframe = window.iframeUrlMap.get(urlWithoutHash)) {
			iframe.style.display = "";
			if (urlWithoutHash !== url) {
				iframe.src = url;
			}
			return;
		} else {
			iframe = createIframe(url);
			window.iframeUrlMap.set(urlWithoutHash, iframe);
		}
	}
});

function createIframe(url) {
	var iframe = document.createElement("iframe");
	iframe.src = url;

	// 右下（面積）25%の領域に表示
	iframe.style.position = "fixed";
	iframe.style.bottom = "0px";
	iframe.style.right = "0px";
	iframe.style.width = "50%";
	iframe.style.height = "50%";
	iframe.style.background = "white";
	
	document.body.appendChild(iframe);
	return iframe;
}
