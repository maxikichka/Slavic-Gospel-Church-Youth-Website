var services = []
var timesLoaded = 0;
var stopAskingForMore = false;
var timeout  = setTimeout(function(){}, 0);
var addStreamPass = "Keystone";

function getDateFormat(dateStr) {
    console.log(dateStr);
    if (dateStr.includes("-")) {
        dateStr = dateStr.split("-")
        dateStr.push(dateStr.shift());
    }
    let mydate = new Date(dateStr);
    let month = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"][mydate.getMonth()];
    return month + " " + mydate.getDate() + ", " + mydate.getFullYear();
}

function closeStreamThing() {
    timesLoaded = 0;
    document.getElementById("links").innerHTML = "";
    fetchForMoreServices();
    document.getElementById("addStream").style.display = "none";
    document.getElementById("servicesElement").style.filter = "";
}

function submitData() {
    let peoples = document.querySelectorAll("#alreadyAdded button");
    let p = ""
    for (let i = 0; i < peoples.length; i += 1) {
        p = p + peoples[i].innerText.replace("\n", "") + ",";
    }
    p = p.slice(0, -1);
    fetch("http://localhost:3000/hereIsNewService", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({date: document.getElementById("addDate").value, url: document.getElementById("addUrl").value, people: p}),
      })
      .then((response) => response.json())
      .then((data) => closeStreamThing(data))
}

function NSpostPerson(data) {
    document.getElementById("addMore").innerText = '';
    console.log(data)
    if (data.length == 0) {
        data.push("Add New Person: " + document.getElementById("addPeople").value);
    }
    for (i in data) {
        let curName = document.createElement("button");
        curName.style.position = "relative";
        curName.style.backgroundColor = "white";
        curName.innerText = data[i];
        curName.id = data[i];
        curName.addEventListener("mouseenter", function(e) {
            let keepWidth = curName.clientWidth;
            curName.innerText = "+";
            curName.style.width = keepWidth + "px";
        })
        curName.addEventListener("mouseleave", function(e) {
            curName.innerText = curName.id;
            curName.style.width = "";
        })
        curName.onclick = function() {
            if (curName.id.includes(": ")) {
                curName.innerText = curName.id.split(": ")[1];
                curName.id = curName.innerText;
            }
            document.getElementById("alreadyAdded").appendChild(curName);
            curName.addEventListener("mouseenter", function(e) {
                let keepWidth = curName.clientWidth;
                curName.innerText = "x";
                curName.style.width = keepWidth + "px";
            })
            curName.addEventListener("mouseleave", function(e) {
                curName.innerText = curName.id;
                curName.style.width = "";
            })
            curName.onclick = function() {
                document.getElementById("alreadyAdded").removeChild(curName);
            }
        };
        document.getElementById("addMore").appendChild(curName);
    }
}

function getPeople(name) {
    fetch("http://localhost:3000/giveMePeople", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({name: name.toLowerCase()}),
      })
      .then((response) => response.json())
      .then((data) => NSpostPerson(data))
}

function displayServices(data) {
    if (data[0] == "No more") {
        stopAskingForMore = true;
        return;
    }
    let linksTitle = "Links to Youth Services";
    if (document.getElementById("startDate").value != "") {
        linksTitle += ' from "' + getDateFormat(document.getElementById("startDate").value) + '"';
    } else {
        linksTitle += ' "from January 1, 0000"'
    }
    if (document.getElementById("endDate").value != "") {
        linksTitle += ' to "' + getDateFormat(document.getElementById("endDate").value) + '"';
    } else {
        linksTitle += ' to "today"';
    }
    if (document.getElementById("people").value != "") {
        console.log(document.getElementById("people").value);
        linksTitle += ' that contain "' + document.getElementById("people").value + '"';
    }
    document.getElementById("linksTitle").innerText = linksTitle;
    timesLoaded += 1;
    let prevServicesLen = services.length;
    services = services.concat(data);
    for (let i = prevServicesLen; i < services.length; i++) {
        let newLink = document.createElement("a");
        newLink.innerText = getDateFormat(services[i].date);
        newLink.href = services[i].link;
        newLink.style.display = "block";
        newLink.style.height = "100px";
        newLink.style.fontSize = "50px";
        newLink.style.color = "black";
        newLink.style.textDecoration = "none";
        newLink.style.borderRadius = "50px";
        newLink.style.background = "#dcdada";
        newLink.style.boxShadow = "20px 20px 60px #868585, -20px -20px 60px #ffffff";
        document.getElementById("links").insertBefore(newLink, document.getElementById("links").firstChild);
    }
}

function fetchForMoreServices() {
    // console.log(document.getElementById("startDate").value);
    fetch("http://localhost:3000/serviceURLs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({x: timesLoaded, startDate: document.getElementById("startDate").value, endDate: document.getElementById("endDate").value, people: document.getElementById("people").value}),
      })
      .then((response) => response.json())
      .then((data) => displayServices(data))
}

// function returnBetweenDates(startDate, endDate) {
//     let servicesBetweenDates = [];
//     startDate = startDate.split("-");
//     startDate.push(startDate.shift());
//     endDate = endDate.split("-");
//     endDate.push(endDate.shift());
//     for (i in services) {
//         let startDateTotalValue = startDate[0] * 35 + startDate[1] + startDate[2] * 5;
//         let evaluatingDateTotalValue = services[i].date.split("/")[0] * 35 + services[i].date.split("/")[1] + services[i].date.split("/")[2] * 5;
//         let endDateTotalValue = endDate[0] * 35 + endDate[1] + endDate[2] * 5;
//         if (evaluatingDateTotalValue >= startDateTotalValue && evaluatingDateTotalValue <= endDateTotalValue) {
//             console.log(startDate, services[i].date, endDate);
//             servicesBetweenDates.push(services[i].date);
//         }
//     }
//     return servicesBetweenDates;
// }

fetchForMoreServices();

function updateSearch() {
    // returnBetweenDates(document.getElementById("startDate").value, document.getElementById("endDate").value)
    timesLoaded = 0;
    document.getElementById("links").innerHTML = "";
    fetchForMoreServices();
}

document.getElementById("searchBtn").onclick = function() {
    updateSearch();
}

document.getElementById("clear").onclick = function() {
    document.getElementById("people").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    updateSearch();
}

document.getElementById("addStreamBtn").onclick = function() {
    if (prompt("Password: ") == addStreamPass) {
        // allow them to add stream
        document.getElementById("addStream").style.display = "inline";
        document.getElementById("servicesElement").style.filter = "blur(5px)";
    }
}

window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // you're at the bottom of the page
        if (stopAskingForMore == false) {
            fetchForMoreServices();
        }
    }
}