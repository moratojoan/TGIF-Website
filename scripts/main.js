/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

var path = window.location.pathname;
var page = path.split("/").pop();
var fileName = location.pathname.split("/").slice(-1)[0];
console.log(path, page, fileName);

var page = document.querySelector('[data-page]').dataset.page;
var url;
if (page == "home") {
    homeMain();
} else if (page == "senate-data" || page == "senate-attendance" || page == "senate-party-loyalty") {
    url = "https://api.propublica.org/congress/v1/113/senate/members.json";
    start_fetch(url);
} else if (page == "house-data" || page == "house-party-loyalty" || page == "house-attendance") {
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
            document.getElementsByClassName("loadContent")[0].style.display = "block";
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
    //START PAGES: SENATE-DATA, HOUSE-DATA
    if (page == "senate-data" || page == "house-data") {
        //Filters by: CheckBoxes, DropDown
        var checkBox = document.getElementsByTagName("input");
        var select = document.getElementsByTagName("select");

        for (let i = 0; i < checkBox.length; i++) {
            checkBox[i].onchange = function () {
                createMembersTable(membersArray, checkBox, select)
            }
        }
        select[0].onchange = function () {
            createMembersTable(membersArray, checkBox, select)
        }

        //Create Table, Create DropDownMenu
        createMembersTable(membersArray, checkBox, select);
        createDropdownMenu(membersArray);
    }
    //FINISH PAGES: SENATE-DATA, HOUSE-DATA

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

//START PAGES: SENATE-DATA, HOUSE-DATA
function createMembersTable(paramMembersArray, paramCheckBox, paramSelect) {
    //Get and clear tbody
    var tbody = document.getElementById("congress-data");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    //Get filter parameters
    var trId = ["D", "R", "I"];
    var filterParty = [];
    for (let i = 0; i < paramCheckBox.length; i++) {
        if (paramCheckBox[i].checked) {
            filterParty.push(trId[i]);
        }
    }
    var filterState = paramSelect[0].selectedOptions[0].value;

    //Fill tbody
    var keysArray = [["url", "first_name", "middle_name", "last_name"], "party", "state", "seniority", "votes_with_party_pct"];
    for (let i = 0; i < paramMembersArray.length; i++) {
        if (memberFulfilFilters(paramMembersArray[i], filterParty, filterState)) {
            let tr = document.createElement("tr");
            for (let j = 0; j < keysArray.length; j++) {
                let td = document.createElement("td");
                if (j === 0) {
                    let a = document.createElement("a");
                    a.setAttribute("href", paramMembersArray[i][keysArray[j][0]]);
                    a.setAttribute("target", "_blank");
                    a.textContent = paramMembersArray[i][keysArray[j][1]];
                    if (paramMembersArray[i][keysArray[j][2]] != null) {
                        a.textContent += " " + paramMembersArray[i][keysArray[j][2]];
                    }
                    a.textContent += " " + paramMembersArray[i][keysArray[j][3]];
                    td.appendChild(a);
                } else if (j === keysArray.length - 1) {
                    td.textContent = paramMembersArray[i][keysArray[j]] + "%";
                } else {
                    td.textContent = paramMembersArray[i][keysArray[j]];
                }
                tr.appendChild(td);
            }
            tr.setAttribute("class", paramMembersArray[i].party + " " + paramMembersArray[i].state);
            tbody.appendChild(tr);
        }
    }

    //If there aren't any row added
    if (!tbody.firstChild) {
        let p = document.createElement("p");
        p.textContent = "There is no member";
        tbody.appendChild(p);
    }
}

function memberFulfilFilters(member, paramFilterParty, paramFilterState) {
    var memeberFulfilParty = false;
    if (paramFilterParty.length == 0) {
        memeberFulfilParty = true;
    } else if (paramFilterParty.includes(member.party)) {
        memeberFulfilParty = true;
    }

    var memberFulfilState = false;
    if (paramFilterState == "Select") {
        memberFulfilState = true;
    } else {
        if (member.state == paramFilterState) {
            memberFulfilState = true;
        }
    }
    return memeberFulfilParty && memberFulfilState
}

function createDropdownMenu(paramMembersArray) {
    var select = document.getElementsByTagName("select")[0];
    var states = listStates(paramMembersArray);
    for (var i = 0; i < states.length; i++) {
        let option = document.createElement("option");
        option.textContent = states[i];
        option.setAttribute("value", states[i]);
        select.appendChild(option);
    }
}

function listStates(paramMembersArray) {
    var states = [];
    for (let i = 0; i < paramMembersArray.length; i++) {
        if (!states.includes(paramMembersArray[i].state)) {
            states.push(paramMembersArray[i].state);
        }
    }
    states.sort();
    return states;
}
//FINISH PAGES: SENATE-DATA, HOUSE-DATA

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
