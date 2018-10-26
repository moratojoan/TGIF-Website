/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

//var path = window.location.pathname;
//var page = path.split("/").pop();
//var fileName = location.pathname.split("/").slice(-1)[0];
//console.log(path, page, fileName);

var page = document.querySelector('[data-page]').dataset.page;
var url;
if (page == "home") {
    homeMain();
} else if (page == "senate-attendance" || page == "senate-party-loyalty") {
    url = "https://api.propublica.org/congress/v1/113/senate/members.json";
    start_fetch(url);
} else if (page == "house-party-loyalty" || page == "house-attendance") {
    url = "https://api.propublica.org/congress/v1/113/house/members.json";
    start_fetch(url);
}

//AJAX
function start_fetch(url) {
    fetch(url, {
            method: "GET",
            headers: {
                "X-API-Key": "Mav6sG8mZwoWpVesShC3VKYBZtpLKchoGj4UZI49"
            }
        })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(function (myData) {
            //this is the only place we know we have the data.
            members = myData.results[0].members;
            main(members);
            document.getElementsByClassName("lds-spinner")[0].style.display = "none";
            document.getElementsByClassName("loadContent_noVue")[0].style.display = "block";
        })
        .catch(function (error) {
            console.log("Request failed: " + error.message);
        })
}


//------------------MAIN----------------------MAIN-----------------------------MAIN--------------
//------------------MAIN----------------------MAIN-----------------------------MAIN--------------
//------------------MAIN----------------------MAIN-----------------------------MAIN--------------
function homeMain() {
    //START PAGE: INDEX
    var a = document.getElementsByClassName("colapseMoreLess");
    for (let i = 0; i < a.length; i++) {
        a[i].onclick = function () {
            moreLess(i)
        }
    }
    //FINISH PAGE: INDEX
}

function main(membersArray) {
    //START PAGES: SENATE/HOUSE-ATTENDANCE, SENATE/HOUSE-PARTY-LOYALTY
    if (page == "senate-attendance" || page == "senate-party-loyalty" || page == "house-attendance" || page == "house-party-loyalty") {
        //Create an array to each Party,
        var democratsArray = [];
        var republicantsArray = [];
        var independentsArray = [];
        for (let i = 0; i < membersArray.length; i++) {
            switch (membersArray[i].party) {
                case "D":
                    democratsArray.push(membersArray[i]);
                    break;
                case "R":
                    republicantsArray.push(membersArray[i]);
                    break;
                case "I":
                    independentsArray.push(membersArray[i]);
                    break;
            }
        }

        //Create the statistics object
        var statistics = {
            "number_of_democrats": democratsArray.length,
            "number_of_republicants": republicantsArray.length,
            "number_of_independents": independentsArray.length,
            "number_total": membersArray.length,
            "average_votes_with_party_pct_D": average(getValuesArrayFromObjectsArray(democratsArray, "votes_with_party_pct")),
            "average_votes_with_party_pct_R": average(getValuesArrayFromObjectsArray(republicantsArray, "votes_with_party_pct")),
            "average_votes_with_party_pct_I": average(getValuesArrayFromObjectsArray(independentsArray, "votes_with_party_pct")),
            "average_votes_with_party_pct_T": average(getValuesArrayFromObjectsArray(membersArray, "votes_with_party_pct"))
        }

        //Plain table Senate/House at a place
        //plainAtAPlace_old(statistics);
    }

    if (page == "senate-party-loyalty" || page == "house-party-loyalty") {
        //Add keys to statistics object
        statistics.members_least_loyal = statisticsLeastMost(membersArray.slice(), 10, "SmallestToHighest", "votes_with_party_pct", "total_votes");
        statistics.members_most_loyal = statisticsLeastMost(membersArray.slice(), 10, "HighestToSmallest", "votes_with_party_pct", "total_votes");

        //Plain Tbodys
        plainTbody("tbody_sumary", plainAtAPlace(statistics));
        plainTbody("tbody_least", statistics.members_least_loyal);
        plainTbody("tbody_most", statistics.members_most_loyal);
    } else if (page == "senate-attendance" || page == "house-attendance") {
        //Add keys to statistics object
        statistics.members_least_engaged = statisticsLeastMost(membersArray.slice(), 10, "HighestToSmallest", "missed_votes_pct", "missed_votes");
        statistics.members_most_engaged = statisticsLeastMost(membersArray.slice(), 10, "SmallestToHighest", "missed_votes_pct", "missed_votes");

        //Plain Tbodys
        plainTbody("tbody_sumary", plainAtAPlace(statistics));
        plainTbody("tbody_least", statistics.members_least_engaged);
        plainTbody("tbody_most", statistics.members_most_engaged);
    }
    //FINISH PAGES: SENATE/HOUSE-ATTENDANCE, SENATE/HOUSE-PARTY-LOYALTY
}

//---------------FUNCTIONS----------------------FUNCTIONS-----------------------------FUNCTIONS--------------
//---------------FUNCTIONS----------------------FUNCTIONS-----------------------------FUNCTIONS--------------
//---------------FUNCTIONS----------------------FUNCTIONS-----------------------------FUNCTIONS--------------

//START PAGE: INDEX
function moreLess(i) {
    var aClicked = document.getElementsByClassName("colapseMoreLess")[i];
    if (aClicked.textContent == "Read more...") {
        aClicked.textContent = "Read less...";
    } else {
        aClicked.textContent = "Read more...";
    }
}
//FINISH PAGE: INDEX

//START PAGES: SENATE/HOUSE-ATTENDANCE, SENATE/HOUSE-PARTY-LOYALTY
function getValuesArrayFromObjectsArray(objectsArray, field) {
    var valuesArray = [];
    for (let i = 0; i < objectsArray.length; i++) {
        valuesArray.push(objectsArray[i][field]);
    }
    return valuesArray;
}

function sumArray(numbersArray) {
    var result = 0;
    for (let i = 0; i < numbersArray.length; i++) {
        result = result + numbersArray[i];
    }
    return result;
}

function average(numbersArray) {
    return sumArray(numbersArray) / numbersArray.length;
}

function statisticsLeastMost(array, persentage, least_most, property1, property2) {
    if (least_most == "SmallestToHighest") {
        array.sort(function (a, b) {
            return a[property1] - b[property1];
            //a.
        });
    } else if (least_most == "HighestToSmallest") {
        array.sort(function (a, b) {
            return b[property1] - a[property1];
        });
    }
    var i = 0; //number of members we want to select
    var actualPersentage = 0;
    while (actualPersentage < persentage) {
        var lastPosition = array[i][property1];
        while (array[i][property1] == lastPosition) { //add all the members with the same value
            i++;
        }
        actualPersentage = (i / array.length) * 100;
    }

    var selectedArray = [];
    for (var j = 0; j < i; j++) {
        let full_name = array[j].first_name;
        if (array[j].middle_name != null) {
            full_name += " " + array[j].middle_name;
        }
        full_name += " " + array[j].last_name;
        selectedArray.push([full_name, array[j][property2], array[j][property1] + "%"]);
    }
    return selectedArray;
}

//function plainAtAPlace_old(paramStatitstics) {
//    document.getElementsByClassName("cell_R_NoR")[0].textContent = paramStatitstics.number_of_republicants;
//    document.getElementsByClassName("cell_D_NoR")[0].textContent = paramStatitstics.number_of_democrats;
//    document.getElementsByClassName("cell_I_NoR")[0].textContent = paramStatitstics.number_of_independents;
//    document.getElementsByClassName("cell_T_NoR")[0].textContent = paramStatitstics.number_total;
//
//    document.getElementsByClassName("cell_R_averageVoted")[0].textContent = paramStatitstics.average_votes_with_party_pct_R.toFixed(2) + "%";
//    document.getElementsByClassName("cell_D_averageVoted")[0].textContent = paramStatitstics.average_votes_with_party_pct_D.toFixed(2) + "%";
//    if (!isNaN(statistics.average_votes_with_party_pct_I)) {
//        document.getElementsByClassName("cell_I_averageVoted")[0].textContent = paramStatitstics.average_votes_with_party_pct_I.toFixed(2) + "%";
//    }
//    document.getElementsByClassName("cell_T_averageVoted")[0].textContent = paramStatitstics.average_votes_with_party_pct_T.toFixed(2) + "%";
//}

function plainAtAPlace(paramStatistics) {
    var rowR = ["Republican", paramStatistics.number_of_republicants, paramStatistics.average_votes_with_party_pct_R.toFixed(2) + "%"];
    var rowD = ["Democrat", paramStatistics.number_of_democrats, paramStatistics.average_votes_with_party_pct_D.toFixed(2) + "%"];
    var rowI = ["Independent", paramStatistics.number_of_independents];
    if (isNaN(paramStatistics.average_votes_with_party_pct_I)) {
        rowI.push("--");
    } else {
        rowI.push(paramStatistics.average_votes_with_party_pct_I.toFixed(2) + "%");
    }
    var rowT = ["Total", paramStatistics.number_total, paramStatistics.average_votes_with_party_pct_T.toFixed(2) + "%"];

    return [rowR, rowD, rowI, rowT]
}

function plainTbody(id, arrayOfMembers) {
    var tbody = document.getElementById(id);
    for (let i = 0; i < arrayOfMembers.length; i++) {
        let tr = document.createElement("tr");
        for (var j = 0; j < arrayOfMembers[i].length; j++) {
            let td = document.createElement("td");
            td.textContent = arrayOfMembers[i][j];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}
//FINSIH PAGES: SENATE/HOUSE-ATTENDANCE, SENATE/HOUSE-PARTY-LOYALTY
