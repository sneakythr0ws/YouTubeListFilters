function filterPlaylist() {
    let list = document.querySelectorAll(".yt-lockup-video");

    if (list.length == 0) {
        list = document.querySelectorAll(".yt-uix-tile");
    }

    list.forEach(e=> {
        let removed = false;
        //filter by name
        filters.names.forEach(f=> {
            if (!removed
                && (e.querySelector(".yt-uix-tile-link").title.toLowerCase().indexOf(f.toLowerCase()) != -1 || e.querySelector(".yt-uix-tile-link").text.toLowerCase().indexOf(f.toLowerCase()) != -1)) {
                e.remove();
                removed = true;
            }
        });

        //filter by channel name
        filters.channels.forEach(f=> {
            if (!removed && e.querySelector(".g-hovercard").text.toLowerCase().indexOf(f.toLowerCase()) != -1) {
                e.remove();
                removed = true;
            }
        });
    });
}

function addFilterButtons() {

    document.querySelectorAll(".yt-lockup-content").forEach(e=> {
        let filterDiv = document.createElement("a");
        filterDiv.appendChild(document.createTextNode("Не показывать видео с этого канала"));

        let value = 'javascript:window.postMessage({ type: "FILTER_ADD_CHANNEL", text: "' + e.querySelector('.g-hovercard').text + '" }, "*");';
        filterDiv.setAttribute("href", value);

        e.appendChild(filterDiv);
    });
}

function addFilter(category, title) {
    if (!title || !category || Object.keys(filters).indexOf(category) == -1) return;

    filters[category].push(title);

    localStorage.setItem("filters", JSON.stringify(filters));

    filterPlaylist();
}

function addMessageListener() {
    var port = chrome.runtime.connect();

    window.addEventListener("message", function (event) {
        // We only accept messages from ourselves
        if (event.source != window)
            return;

        if (event.data.type && (event.data.type == "FILTER_ADD_CHANNEL")) {
            console.log("Content script received: " + event.data.text);
            addFilter("channels", event.data.text);
            port.postMessage(event.data.text);
        }
    }, false);
}

var filters;

if (localStorage.getItem("filters")) {
    filters = JSON.parse(localStorage.getItem("filters"));
} else {
    filters = {
        names: [],
        channels: []
    };

    localStorage.setItem("filters", JSON.stringify(filters));
}

filterPlaylist();

addFilterButtons();

addMessageListener();