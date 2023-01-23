// ==UserScript==
// @name         Researcher-app open article in new tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://www.researcher-app.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=researcher-app.com
// @grant        none
// ==/UserScript==

//JS 获取最后一个 指定字符  后面的值
function getValue(url){
    //获取最后一个/的位置
    var site = url.lastIndexOf("\/");
    //截取最后一个/后的值
    return url.substring(site + 1, url.length);
}

function addPaperLink(node) {
    const paperId = node.getAttribute('x-track-detail').split(':')[1].split('}')[0];
    node.firstChild.innerHTML += `<a href="${'/paper/' + paperId.replace(',','')}" target="_blank" class="${node.firstChild.firstChild.getAttribute('class')}">open article in new tab</a>`
}

(function() {
    'use strict';
    const docMutationCallback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    try {
                        var tags = getValue(window.location.href);
                        if (node.getAttribute('x-track-id') === 'paper' && document.location.href.endsWith('feed/'+tags)) {
                            addPaperLink(node);
                        }
                    } catch (err) {
                        if (err.name == 'TypeError') {
                            continue;
                        }
                    }
                }
            }
        }
    }
    const docMutationObserver = new MutationObserver(docMutationCallback);
    docMutationObserver.observe(document, { attributes: false, childList: true, subtree: true});
})();
