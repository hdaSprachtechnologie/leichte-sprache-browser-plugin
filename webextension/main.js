const MINIMUM_WORD_LENGTH = 4;

let relevantTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'p', 'article', 'section', 'header', 'div', 'span'];
let excludeElements = ['script', 'style', 'iframe', 'canvas'];
let progressMainSteps = {
	collect: 2,
	fetch: 10,
	iterate: 80
};
let idProgressTimer = null;

function collectAllRelevantNodes() {
	"use strict";
	console.debug("start collectAllRelevantNodes");
	let nodes = [];
	relevantTags.forEach(element => {
		let htmlCollection = document.getElementsByTagName(element);
		for (let i = 0; i < htmlCollection.length; i++) {
			nodes.push(htmlCollection[i]);
		}
	});
	return nodes;
}

//<span class="simple-lang">
//	word
//  <div class="simple-lang-tooltip-wrap">
//		<div class="simple-lang-tooltip">easy</div>
//	</div>
//</span>
function createExplanationNode(word, easy) {
	"use strict";
	let span = document.createElement("span");
	span.className = "simple-lang";
	span.textContent = word;
	let divmain = document.createElement("div");
	divmain.className = "simple-lang-tooltip-wrap";
	let divdesc = document.createElement("div");
	divdesc.className = "simple-lang-tooltip";
	divdesc.textContent = easy;
	divmain.appendChild(divdesc);
	span.appendChild(divmain);
	return span;
}

function handleResponse(data) {
	"use strict";
	console.debug("handleResponse: %s", data);
	showProgress(progressMainSteps.iterate);
	let replacements = data.replacements;
	//let replacements = [{ org: "Studieninteressierte", easy: "info" }, { org: "Fachbereich", easy: "info" }, { org: "Informatik", easy: "info" }];
	if (!replacements || replacements.length == 0) {
		hideProgressBar();
		return;
	}

	let node = document.getElementsByTagName("body")[0];
	let progressStart = progressMainSteps.iterate;
	let progressStep = (100 - progressStart) / replacements.length;
	let countSteps = 0;
	replacements.forEach(element => {
		countSteps++;
		showProgress(progressStart + countSteps * progressStep);
		console.debug("call match from foreach with %s and %s", node.tagName, element.org);
		matchText(node, new RegExp("\\b" + element.org + "\\b", "g"), function (currentNode) {
			if (currentNode.data) {
				let rightText = null;
				let leftText = null;
				if (currentNode.data.length > element.org.length) {
					let pos = currentNode.data.indexOf(element.org) + element.org.length;
					if (currentNode.data.length < pos) {
						rightText = currentNode.splitText(pos);
					}
					else {
						leftText = currentNode.splitText(currentNode.data.indexOf(element.org));
						if (leftText.data && leftText.data.length > element.org.length)
							rightText = leftText.splitText(element.org.length);
					}
				}
				if (currentNode.parentNode) {
					let newNode = createExplanationNode(element.org, element.easy);
					if (leftText)
						currentNode.parentNode.replaceChild(newNode, leftText);
					else
						currentNode.parentNode.replaceChild(newNode, currentNode);
					currentNode = newNode;
				}
			}
			return currentNode;
		});
	});
	hideProgressBar();
}

//@see http://blog.alexanderdickson.com/javascript-replacing-text
function matchText(node, regex, callback) {
	"use strict";
	let child = node.firstChild;
	if (child && child.nodeType)
		do {
			switch (child.nodeType) {
				case 1:
					if (excludeElements.indexOf(child.tagName.toLowerCase() || child.className == "simple-lang") > -1) {
						continue;
					}
					matchText(child, regex, callback);
					break;
				case 3:
					if (child.data && child.data.trim().length > MINIMUM_WORD_LENGTH) {
						child.data.replace(regex, function () { child = callback(child); });
					}
					break;
			}
		} while (child = child.nextSibling);
}

function collectRelevantWords() {
	"use strict";
	let relevantNodes = collectAllRelevantNodes();
	let relevantWords = [];
	relevantNodes.forEach(node => {
		let words = node.innerText.split(" ");
		words.forEach(word => {
			word = word.trim();
			if (word.length > MINIMUM_WORD_LENGTH && relevantWords.indexOf(word) < 0) {
				relevantWords.push(word);
			}
		});
	});
	return relevantWords;
}
function fetchEasyLanguage(words) {
	"use strict";
	let url = 'http://localhost:8888/easywordlist'; // localhost
	console.debug("fetch from server: %s", url);
	postData(url, words)
		.then(data => handleResponse(data)) // JSON-string from `response.json()` call
		.catch(error => { hideProgressBar(); console.error(error);  alert(error); });
}

function postData(url, data) {
	let json = JSON.stringify(data);
	"use strict";
	console.debug("json:" + json);
	return fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: json
	})
		.then(response => response.json()); // parses JSON response into native Javascript objects 
}

function showProgressBar() {
	"use strict";
	console.debug("start long process");
	//create if needed <div id="hdaProgressBar"><div id="hdaProgress"></div></div> 
	let pb = document.getElementById("hdaProgressBar");
	let body = document.getElementsByTagName("body")[0];
	if (!pb) {
		pb = document.createElement("div");
		pb.id = "hdaProgressBar";
		let node = document.createElement("div");
		node.id = "hdaProgress";
		pb.appendChild(node);
		body.insertBefore(pb, body.firstChild);
	}
	pb.style.display = "block";
}
function showProgress(progress, upTo = 0) { //no use strict due to default parameter
	if (progress < 0 || progress > 100)
		return;
	if (idProgressTimer){
		clearInterval(idProgressTimer);
		idProgressTimer = null;
	}
	progress = Math.floor(progress);
	var progressBar = document.getElementById("hdaProgress");
	progressBar.style.width = progress + '%';
	
	if (upTo > 0) {
		var width = progress;
		idProgressTimer = setInterval(frame, 150);
		function frame() {
			if (width >= upTo) {
				clearInterval(idProgressTimer);
			} else {
				width++;
				progressBar.style.width = width + '%';
			}
		}
	}
}
function hideProgressBar() {
	"use strict";
	console.debug("finnished long process");
	document.getElementById("hdaProgressBar").style.display = "none";
}
function main() {
	"use strict";
	showProgressBar();
	let relevantWords = collectRelevantWords();
	showProgress(progressMainSteps.collect);
	console.debug("relevant words: %s", relevantWords);
	showProgress(progressMainSteps.fetch, progressMainSteps.iterate);

	fetchEasyLanguage(relevantWords);
}

main();
