// GLOBAL VARIABLES
let allStops = null;
const URL = "http://66.11.123.158:8080/"; //Hosted URL

// HTML REFRENCES
let startSelect = null;
let endSelect = null;

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
        option.innerText = `${route.name}`;
        startSelect.appendChild(option);
        endSelect.appendChild(option.cloneNode(true));
      });
    });

    disableButtonIfSame();
}

function disableButtonIfSame() {
    if (startSelect.value == endSelect.value) {
        document.getElementById("submit-btn").disabled = true;
    } else {
        document.getElementById("submit-btn").disabled = false;
    }
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
      json.lines.forEach((line, i) => {
        const lineDiv = document.importNode(lineTemplate.content, true);

        const lineName = lineDiv.querySelector("p");
        lineName.innerText = `${line.name}`;
        const lineIcon = lineDiv.querySelector("i");
        if (line.type == "bus") {
            lineIcon.className += " fa-solid fa-bus";
        } else {
            lineIcon.className += " fa-solid fa-train-subway";
        }

        const lineStopsList = lineDiv.querySelector("ol");
        line.stops.forEach((stop, j) => {
            const stopItem = document.createElement("li");
            const stopText = document.createElement("p");
            const stopIcon = document.createElement("i");

            stopText.innerText = `${stop.name}`;
            if (j == 0) {
                stopIcon.className += "fa-solid fa-person-walking-arrow-right fa-flip-horizontal enter-icon"; 
            }else if (j == line.stops.length - 1 && i == json.lines.length - 1) {
                stopIcon.className += "fa-solid fa-location-dot finish-icon";
                stopItem.appendChild(stopIcon);
                stopItem.appendChild(stopText);
                lineStopsList.appendChild(stopItem);
                return;
            }else if (j == line.stops.length - 1) {
                stopIcon.className += "fa-solid fa-person-walking-arrow-right exit-icon";
            }

            stopItem.appendChild(stopText);
            stopItem.appendChild(stopIcon);
            lineStopsList.appendChild(stopItem);
        });

        /* lineDiv.querySelector("div").style.backgroundColor = getRandomBackgroundColor(50, 0.3); */

        routeDiv.appendChild(lineDiv);
      });
    });
}
function getRandomBackgroundColor(max, aplha) {
  function getRandomNum(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
  return `rgba(${getRandomNum(0, max)}, ${getRandomNum(0, 255)}, ${getRandomNum(0, 255)}, ${aplha})`;
}


