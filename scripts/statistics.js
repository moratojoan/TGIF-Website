/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

var page = document.getElementsByTagName("header")[0].className.split(" ")[0];

if (page == "senate-attendance" || page == "senate-party-loyalty" || page == "house-party-loyalty" || page == "house-attendance") {
    var data = data;
    var membersArray = data.results[0].members;
    var democratsArray = [];
    var republicantsArray = [];
    var independentsArray = [];
    var i;
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

    var statistics = {
        "number_of_democrats": democratsArray.length,
        "number_of_republicants": republicantsArray.length,
        "number_of_independents": independentsArray.length,
        "average_votes_with_party_pct_D": average(getValuesArrayFromObjectsArray(democratsArray, "votes_with_party_pct")),
        "average_votes_with_party_pct_R": average(getValuesArrayFromObjectsArray(republicantsArray, "votes_with_party_pct")),
        "average_votes_with_party_pct_I": average(getValuesArrayFromObjectsArray(independentsArray, "votes_with_party_pct"))
    }

    plainSenateAtAPlace();
}

if (page == "senate-party-loyalty" || page == "house-party-loyalty") {
    statistics.members_least_loyal = statisticsLeastMost(membersArray.slice(), 10, "SmallestToHighest", "votes_with_party_pct", "total_votes");
    statistics.members_most_loyal = statisticsLeastMost(membersArray.slice(), 10, "HighestToSmallest", "votes_with_party_pct", "total_votes");
} else if (page == "senate-attendance" || page == "house-attendance") {
    statistics.members_least_engaged = statisticsLeastMost(membersArray.slice(), 10, "HighestToSmallest", "missed_votes_pct", "missed_votes");
    statistics.members_most_engaged = statisticsLeastMost(membersArray.slice(), 10, "SmallestToHighest", "missed_votes_pct", "missed_votes");
}

if (page == "senate-party-loyalty" || page == "house-party-loyalty") {
    plainTbody("tbody_least", statistics.members_least_loyal);
    plainTbody("tbody_most", statistics.members_most_loyal);
} else if (page == "senate-attendance" || page == "house-attendance") {
    plainTbody("tbody_least", statistics.members_least_engaged);
    plainTbody("tbody_most", statistics.members_most_engaged);
}

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

function plainSenateAtAPlace() {
    document.getElementsByClassName("cell_R_NoR")[0].textContent = statistics.number_of_republicants;
    document.getElementsByClassName("cell_D_NoR")[0].textContent = statistics.number_of_democrats;
    document.getElementsByClassName("cell_I_NoR")[0].textContent = statistics.number_of_independents;

    document.getElementsByClassName("cell_R_averageVoted")[0].textContent = statistics.average_votes_with_party_pct_R.toFixed(2) + "%";
    document.getElementsByClassName("cell_D_averageVoted")[0].textContent = statistics.average_votes_with_party_pct_D.toFixed(2) + "%";

    if (!isNaN(statistics.average_votes_with_party_pct_I)){
        document.getElementsByClassName("cell_I_averageVoted")[0].textContent = statistics.average_votes_with_party_pct_I.toFixed(2) + "%";
    }
    
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
