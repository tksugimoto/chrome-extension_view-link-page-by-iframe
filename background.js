"use strict";

var VIEW_LINK_PAGE = "a";

function createContextMenus() {
	chrome.contextMenus.create({
		title: "リンク先を見る",
		contexts: ["link"],
		id: VIEW_LINK_PAGE
	});
}

chrome.runtime.onStartup.addListener(createContextMenus);
chrome.runtime.onInstalled.addListener(() => {
	createContextMenus();

	// 読み込み/更新時に既存のタブで実行する
	chrome.tabs.query({
		url: "*://*/*"
	}, tabs => {
		tabs.forEach(tab => {
			chrome.tabs.executeScript(tab.id, {
				file: "content_script.js"
			}, result => {
				if (typeof result === "undefined") {
					console.info("ページが読み込まれていません", tab);
				}
			});
		});
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === VIEW_LINK_PAGE) {
		chrome.tabs.sendMessage(tab.id, {
			method: "viewLinkPage",
			url: info.linkUrl
		});
	}
});
