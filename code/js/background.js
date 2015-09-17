//Default replacements
var default_replacements = [
    ['raccoon', 'trash panda'],
    ['raccoons', 'trash pandas'],
    ['racoon', 'trash panda'],
    ['racoons', 'trash pandas'],
    ['giraffe', 'long horse'],
    ['dog', 'horse'],
    ['indonesia', 'French Indochina'],
    ['Indonesian', 'Cochinchinese'],
    ['Thailand', 'Siam'],
    ['Thai', 'Siamese'],
    ['hipster style', 'dumpster chic'],
    ['Obama', 'Owen Wilson'],
    ['Barack Obama', 'Owen Wilson']
    ['blue', 'churlishly red'],
    ['vegan bacon', 'nope'],
    ['beer', 'Natty Ice'],
    ['phone', 'CB radio'],
    ['women\'s lacrosse', 'organized catch'],
    ['harrison ford', 'tom Haverford'],
    ['pavel datsyuk', 'the magic man'],
    ['marijuana', 'devil\'s lettuce'],
    ['earth', 'pale blue dot'],
    ['jay-z', 'Bert'],
    ['jay z', 'Bert'],
    ['beyonce', 'Ernie'],
    ['beyonc\u00E9', 'Ernie'],
    ['a recession', 'goblintown'],
    ['short shorts', 'party pants'],
    ['football', 'foosball'],
    ['Chicago', 'ChIraq'],
    ['rocks', 'minerals'],
    ['Samuel Adams', 'Samuel L. Jackson'],
    ['Sam Adams', 'Samuel L. Jackson'],
    ['wooden', 'shoddily constructed plywood'],
    ['cotton', 'pleather'],
    ['Russia', 'the armpit of Eastern Europe'],
    ['computer', 'wonderful computing machine'],
    ['Edward Scissorhands', 'Salad Fingers'],
    ['paper', 'papyrus'],
    ['tom hanks', 'Paul Rudd'],
    ['Leonardo DiCaprio', 'Paul Rudd'],
    ['Johnny Depp', 'Paul Rudd'],
    ['Depp', 'Paul Rudd'],
    ['tom cruise', 'TOM FUCKIN\' CRUISE'],
    ['top gun', 'the greatest movie of all time'],
    ['wifi', 'magical internet vibrations'],
    ['public transportation', 'magic carpets'],
    ['beard', 'neck beard'],
    ['a win', 'a supreme allied victory'],
    ['taco bell', 'Taco de la Campana'],
    ['horizontal', 'vertical'],
    ['vertical', 'horizontal'],
    ['diagonal', '4-dimensional'],
    ['salad', 'rabbit food'],
    ['salads', 'rabbit food'],
    ['arabic', 'aramaic'],
    ['glasses', 'underpowered binoculars'],
    ['table', 'stable'],
    ['william', 'ol\' Billy'],
    ['cat', 'jaguar'],
    ['stoned', 'high as Raymundo Rocket']
];
//Default Blacklist
var default_blacklisted_sites = ["docs.google.com",
    "gmail.com",
    "mail.google.com",
    "mail.yahoo.com",
    "outlook.com",
]

debug = false;

function checkBlackList(url, blacklist) {
    url = url.toLowerCase() || "";
    blacklist = blacklist || [];
    for (var i = blacklist.length - 1; i >= 0; i--) {
        if (url.indexOf(blacklist[i]) > -1) {
            return false;
        }
    };
    return true;
}

function injectionScript(tabId, info, tab) {
    if (debug) console.log("injection fire");
    chrome.storage.sync.get(null, function(result) {
        if (result["status"] === "enabled" && checkBlackList(tab.url, result['blacklist'])) {
            chrome.tabs.executeScript(tabId, {
                file: "js/substitutions.js",
                runAt: "document_end"
            });
        }
    });
}

function addMessage(request, sender, sendResponse) {
    if (debug) console.log("message fire");
    chrome.storage.sync.get(null, function(result) {
        if (request === "config" && result["replacements"]) {
            sendResponse(result["replacements"]);
        }
    });
    return true;
}

function fixDataCorruption() {
    if (debug) console.log("updateStore");
    chrome.storage.sync.get(null, function(result) {
        if (!result["status"]) {
            chrome.storage.sync.set({
                "status": "enabled"
            });
        }
        if (!result["replacements"]) {
            chrome.storage.sync.set({
                "replacements": default_replacements
            });
        }
        if (!result["replacements"]) {
            chrome.storage.sync.set({
                "blacklist": default_blacklisted_sites
            });
        }
    });
}

function toggleActive() {
    if (debug) console.log("clickfire");
    chrome.storage.sync.get("status", function(result) {
        if (result["status"] === null) {
            status = "enabled";
        } else {
            status = result["status"];
        }
        if (status === "enabled") {
            icon = {
                "path": "images/disabled.png"
            };
            message = {
                "title": "click to enable xkcd substitutions"
            };
            status = "disabled";
        } else if (status === "disabled") {
            icon = {
                "path": "images/enabled.png"
            };
            message = {
                "title": "click to disabled xkcd substitutions"
            };
            status = "enabled";
        }
        chrome.browserAction.setIcon(icon);
        chrome.browserAction.setTitle(message);
        chrome.storage.sync.set({
            "status": status
        });
    });
}

chrome.browserAction.onClicked.addListener(toggleActive);
chrome.runtime.onMessage.addListener(addMessage);
chrome.tabs.onUpdated.addListener(injectionScript);
chrome.runtime.onInstalled.addListener(fixDataCorruption);
chrome.runtime.onStartup.addListener(fixDataCorruption);
