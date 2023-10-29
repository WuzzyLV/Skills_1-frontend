// GLOBAL VARIABLES
let allStops= null;
const URL="http://localhost:8080/"

// HTML REFRENCES
let startSelect = null;
let endSelect= null;

function startUp() {
    //Populate the select boxes
    startSelect = document.getElementById("start");
    endSelect = document.getElementById("end");

    fetch(URL + "routes")
    .then((response) => response.json())
    .then((json) => {
        allStops = json;
        allStops.forEach((route) => {
            const option = document.createElement("option");
            option.value = route.id;
            option.innerText = `${route.id} : ${route.name}`;
            startSelect.appendChild(option);
            endSelect.appendChild(option.cloneNode(true));
        })
    })
}

function getRoute() {
    const startId = startSelect.value;
    const endId = endSelect.value;

    const routeDiv = document.getElementById("route");
    routeDiv.innerHTML = null;

    const lineTemplate = document.querySelector("#line-template");

    fetch(URL + "route/" + startId + "/" + endId)
    .then((response) => response.json())
    .then((json) => {
        json.lines.forEach((line) => {
            const lineDiv = document.importNode(lineTemplate.content, true);

            const lineName = lineDiv.querySelector("p");
            lineName.innerText = `${line.id} : ${line.name}`;

            const lineStopsList = lineDiv.querySelector("ol");
            line.stops.forEach((stop) => {
                const stopItem = document.createElement("li");
                stopItem.innerText = `${stop.id} : ${stop.name}`;
                lineStopsList.appendChild(stopItem);
            })

            lineDiv.querySelector("div").style.backgroundColor 
            = getRandomBackgroundColor(50, 0.3);

            routeDiv.appendChild(lineDiv);
        })
    });
}
function getRandomBackgroundColor(max, aplha) {
    function getRandomNum(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    return `rgba(${getRandomNum(0,max)}, ${getRandomNum(0,255)}, ${getRandomNum(0,255)}, ${aplha})`;
}

