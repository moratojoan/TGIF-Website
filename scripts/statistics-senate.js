/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

var page = document.getElementsByTagName("header")[0].className.split(" ")[0];

if (page == "senate-attendance" || page == "senate-party-loyalty") {
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
        "average_votes_with_party_pct_of_democrats": average(getValuesArrayFromObjectsArray(democratsArray, "votes_with_party_pct")),
        "average_votes_with_party_pct_of_republicants": average(getValuesArrayFromObjectsArray(republicantsArray, "votes_with_party_pct")),
        "average_votes_with_party_pct_of_independents": average(getValuesArrayFromObjectsArray(independentsArray, "votes_with_party_pct"))
    }
    
    document.getElementsByClassName("cell_R_NoR")[0].textContent = statistics.number_of_republicants;
    document.getElementsByClassName("cell_D_NoR")[0].textContent = statistics.number_of_democrats;
    document.getElementsByClassName("cell_I_NoR")[0].textContent = statistics.number_of_independents;
    
    document.getElementsByClassName("cell_R_averageVoted")[0].textContent = statistics.average_votes_with_party_pct_of_republicants.toFixed(2)+"%";
    document.getElementsByClassName("cell_D_averageVoted")[0].textContent = statistics.average_votes_with_party_pct_of_democrats.toFixed(2)+"%";
    document.getElementsByClassName("cell_I_averageVoted")[0].textContent = statistics.average_votes_with_party_pct_of_independents.toFixed(2)+"%";
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

console.log(JSON.stringify(statistics));
