/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

//START: VAR GLOBALS
var page = document.querySelector('[data-page]').dataset.page;
var i;
//FINISH: VAR GLOBALS


//START: GET DATA
if (page == "senate-data" || page == "house-data" || page == "senate-attendance" || page == "senate-party-loyalty" || page == "house-party-loyalty" || page == "house-attendance") {
    var data = data;
    var membersArray = data.results[0].members;
}
//FINISH: GET DATA

//START PAGE: INDEX
if (page == "home") {
    var a = [document.getElementById("about_colapse"), document.getElementById("history_colapse")];
    for (i = 0; i < a.length; i++) {
        a[i].onclick = function () {
            moreLess(this.id)
        }
    }
}
//FINISH PAGE: INDEX

//START PAGES: SENATE-DATA, HOUSE-DATA
if (page == "senate-data" || page == "house-data") {
    //Filters by: CheckBoxes, DropDown
    var checkBox = document.getElementsByClassName("checkBoxFilter");
    for (i = 0; i < checkBox.length; i++) {
        checkBox[i].onchange = function () {
            createMembersTable(membersArray)
        }
    }
    var select = document.getElementsByTagName("select");
    select[0].onchange = function () {
        createMembersTable(membersArray)
    }

    //Create Table, Create DropDownMenu
    createMembersTable(membersArray);
    createDropdownMenu(membersArray);
}
//FINISH PAGES: SENATE-DATA, HOUSE-DATA

//START PAGES: SENATE/HOUSE-ATTENDANCE, SENATE/HOUSE-PARTY-LOYALTY
if (page == "senate-attendance" || page == "senate-party-loyalty" || page == "house-attendance" || page == "house-party-loyalty") {
    //Create an array to each Party,
    var democratsArray = [];
    var republicantsArray = [];
    var independentsArray = [];
    for (i = 0; i < membersArray.length; i++) {
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
    plainAtAPlace();
}

if (page == "senate-party-loyalty" || page == "house-party-loyalty") {
    //Add keys to statistics object
    statistics.members_least_loyal = statisticsLeastMost(membersArray.slice(), 10, "SmallestToHighest", "votes_with_party_pct", "total_votes");
    statistics.members_most_loyal = statisticsLeastMost(membersArray.slice(), 10, "HighestToSmallest", "votes_with_party_pct", "total_votes");

    //Plain Tbodys
    plainTbody("tbody_least", statistics.members_least_loyal);
    plainTbody("tbody_most", statistics.members_most_loyal);
} else if (page == "senate-attendance" || page == "house-attendance") {
    //Add keys to statistics object
    statistics.members_least_engaged = statisticsLeastMost(membersArray.slice(), 10, "HighestToSmallest", "missed_votes_pct", "missed_votes");
    statistics.members_most_engaged = statisticsLeastMost(membersArray.slice(), 10, "SmallestToHighest", "missed_votes_pct", "missed_votes");

    //Plain Tbodys
    plainTbody("tbody_least", statistics.members_least_engaged);
    plainTbody("tbody_most", statistics.members_most_engaged);
}
//FINISH PAGES: SENATE/HOUSE-ATTENDANCE, SENATE/HOUSE-PARTY-LOYALTY


//---------------FUNCTIONS----------------------FUNCTIONS-----------------------------FUNCTIONS--------------
//---------------FUNCTIONS----------------------FUNCTIONS-----------------------------FUNCTIONS--------------
//---------------FUNCTIONS----------------------FUNCTIONS-----------------------------FUNCTIONS--------------
//START PAGE: INDEX
function moreLess(id) {
    var aClicked = document.getElementById(id);
    if (aClicked.textContent == "Read more...") {
        aClicked.textContent = "Read less...";
    } else {
        aClicked.textContent = "Read more...";
    }
}
//FINISH PAGE: INDEX

//START PAGES: SENATE-DATA, HOUSE-DATA
function createMembersTable(paramMembersArray) {
    var tbody,
        tr,
        td,
        a,
        i,
        j;

    //Get and clear tbody
    tbody = document.getElementById("congress-data");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    //Get filter parameters
    var trId = ["D", "R", "I"];
    var filterParty = [];
    for (i = 0; i < checkBox.length; i++) {
        if (checkBox[i].checked) {
            filterParty.push(trId[i]);
        }
    }
    var filterState = select[0].selectedOptions[0].value;

    //Fill tbody
    var keysArray = [["url", "first_name", "middle_name", "last_name"], "party", "state", "seniority", "votes_with_party_pct"];
    for (i = 0; i < paramMembersArray.length; i++) {
        if (memberFulfilFilters(paramMembersArray[i], filterParty, filterState)) {
            tr = document.createElement("tr");
            for (j = 0; j < keysArray.length; j++) {
                td = document.createElement("td");
                if (j === 0) {
                    a = document.createElement("a");
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
        var p = document.createElement("p");
        p.textContent = "There is no member";
        tbody.appendChild(p);
    }
}

function memberFulfilFilters(member, paramFilterParty, paramFilterState) {
    var memeberFulfilParty = false;
    if (paramFilterParty.length == 0) {
        memeberFulfilParty = true;
    } else {
        for (var k = 0; k < paramFilterParty.length; k++) {
            if (member.party == paramFilterParty[k]) {
                memeberFulfilParty = true;
            }
        }
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
    var select,
        option,
        states;
    select = document.getElementsByTagName("select")[0];
    states = listStates(paramMembersArray);
    for (var i = 0; i < states.length; i++) {
        option = document.createElement("option");
        option.textContent = states[i];
        option.setAttribute("value", states[i]);
        select.appendChild(option);
    }
}

function listStates(paramMembersArray) {
    var states = [];
    for (var i = 0; i < paramMembersArray.length; i++) {
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
    for (var i = 0; i < objectsArray.length; i++) {
        valuesArray.push(objectsArray[i][field]);
    }
    return valuesArray;
}

function sumArray(numbersArray) {
    var result = 0;
    for (var i = 0; i < numbersArray.length; i++) {
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
    var i = 0;
    var actualPersentage = 0;
    while (actualPersentage < persentage) {
        var lowest = array[i][property1];
        while (array[i][property1] == lowest) {
            i++;
        }
        actualPersentage = (i / array.length) * 100;
    }

    var selectedArray = [];
    var full_name;
    for (var j = 0; j < i; j++) {
        full_name = array[j].first_name;
        if (array[j].middle_name != null) {
            full_name += " " + array[j].middle_name;
        }
        full_name += " " + array[j].last_name;
        selectedArray.push([full_name, array[j][property2], array[j][property1] + "%"]);
    }
    return selectedArray;
}

function plainAtAPlace() {
    document.getElementsByClassName("cell_R_NoR")[0].textContent = statistics.number_of_republicants;
    document.getElementsByClassName("cell_D_NoR")[0].textContent = statistics.number_of_democrats;
    document.getElementsByClassName("cell_I_NoR")[0].textContent = statistics.number_of_independents;
    document.getElementsByClassName("cell_T_NoR")[0].textContent = statistics.number_total;

    document.getElementsByClassName("cell_R_averageVoted")[0].textContent = statistics.average_votes_with_party_pct_R.toFixed(2) + "%";
    document.getElementsByClassName("cell_D_averageVoted")[0].textContent = statistics.average_votes_with_party_pct_D.toFixed(2) + "%";
    if (!isNaN(statistics.average_votes_with_party_pct_I)) {
        document.getElementsByClassName("cell_I_averageVoted")[0].textContent = statistics.average_votes_with_party_pct_I.toFixed(2) + "%";
    }
    document.getElementsByClassName("cell_T_averageVoted")[0].textContent = statistics.average_votes_with_party_pct_T.toFixed(2) + "%";

}

function plainTbody(className, arrayOfMembers) {
    var tbody = document.getElementsByClassName(className)[0];
    var tr;
    for (var i = 0; i < arrayOfMembers.length; i++) {
        tr = document.createElement("tr");
        var td;
        for (var j = 0; j < arrayOfMembers[i].length; j++) {
            td = document.createElement("td");
            td.textContent = arrayOfMembers[i][j];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}
//FINSIH PAGES: SENATE/HOUSE-ATTENDANCE, SENATE/HOUSE-PARTY-LOYALTY
