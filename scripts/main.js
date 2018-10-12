/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

var page = document.getElementsByTagName("header")[0].className.split(" ")[0];


if (page == "senate" || page == "house") {
    var data = data;
    var membersArray = data.results[0].members;
    var keysArray = [["url", "first_name", "last_name", "middle_name"], "party", "state", "seniority", "votes_with_party_pct"];
    createTable(membersArray);
    createDropdownMenu(membersArray);
}

function createTable(paramMembersArray) {
    var tbody,
        tr,
        td,
        a;
    tbody = document.getElementById("congress-data");
    for (var i = 0; i < paramMembersArray.length; i++) {
        tr = document.createElement("tr");
        for (var j = 0; j < keysArray.length; j++) {
            td = document.createElement("td");
            if (j === 0) {
                a = document.createElement("a");
                a.setAttribute("href", paramMembersArray[i][keysArray[j][0]]);
                a.setAttribute("target", "_blank");
                a.textContent = paramMembersArray[i][keysArray[j][1]];
                a.textContent += " " + paramMembersArray[i][keysArray[j][2]];
                if (paramMembersArray[i][keysArray[j][3]] != null) {
                    a.textContent += " " + paramMembersArray[i][keysArray[j][3]];
                }
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
        var isAlreadyAdded = false;
        for (var j = 0; j < states.length; j++) {
            if (paramMembersArray[i].state == states[j]) {
                isAlreadyAdded = true;
            }
        }
        if (!isAlreadyAdded) {
            states.push(paramMembersArray[i].state);
        }
    }
    states.sort();
    return states;
}

//Function to change the Read more.. to Read less...
if (page == "home") {
    var a = [document.getElementById("about_colapse"), document.getElementById("history_colapse")];
    for (var i = 0; i < a.length; i++) {
        a[i].onclick = function () {
            MoreLess(this.id)
        }
    }
}

function MoreLess(id) {
    var aClicked = document.getElementById(id);
    if (aClicked.textContent == "Read more...") {
        aClicked.textContent = "Read less...";
    } else {
        aClicked.textContent = "Read more...";
    }
}


//Filter by Party Option 1:
//if (page == "senate") {
//    var checkBoxD = document.getElementById("checkBoxD");
//    var checkBoxR = document.getElementById("checkBoxR");
//    var checkBoxI = document.getElementById("checkBoxI");
//    var checkBox = [checkBoxD, checkBoxR, checkBoxI];
//    var trD = document.getElementsByClassName("D");
//    var trR = document.getElementsByClassName("R");
//    var trI = document.getElementsByClassName("I");
//
//    for (var j = 0; j < checkBox.length; j++) {
//        checkBox[j].onchange = function () {
//            filterByParty()
//        }
//    }
//}
//
//function filterByParty() {
//    var checkBoxChecked = detectCheckBoxChecked(checkBox);
//    if (checkBoxChecked.length == 0 || checkBoxChecked.length == checkBox.length) {
//        for (i = 0; i < trD.length; i++) {
//            trD[i].style.display = "table-row";
//        }
//        for (i = 0; i < trR.length; i++) {
//            trR[i].style.display = "table-row";
//        }
//        for (i = 0; i < trI.length; i++) {
//            trI[i].style.display = "table-row";
//        }
//    } else {
//        var isDChecked = false;
//        var isRChecked = false;
//        var isIChecked = false;
//        for (i = 0; i < checkBoxChecked.length; i++) {
//            if (checkBoxChecked[i].id == "checkBoxD") {
//                isDChecked = true;
//            } else if (checkBoxChecked[i].id == "checkBoxR") {
//                isRChecked = true;
//            } else if (checkBoxChecked[i].id == "checkBoxI") {
//                isIChecked = true;
//            }
//        }
//        if (isDChecked) {
//            for (i = 0; i < trD.length; i++) {
//                trD[i].style.display = "table-row";
//            }
//        } else {
//            for (i = 0; i < trD.length; i++) {
//                trD[i].style.display = "none";
//            }
//        }
//
//        if (isRChecked) {
//            for (i = 0; i < trR.length; i++) {
//                trR[i].style.display = "table-row";
//            }
//        } else {
//            for (i = 0; i < trR.length; i++) {
//                trR[i].style.display = "none";
//            }
//        }
//
//        if (isIChecked) {
//            for (i = 0; i < trI.length; i++) {
//                trI[i].style.display = "table-row";
//            }
//        } else {
//            for (i = 0; i < trI.length; i++) {
//                trI[i].style.display = "none";
//            }
//        }
//    }
//}
//
//function detectCheckBoxChecked(checkBoxArray) {
//    var checkBoxChecked = [];
//    for (var i = 0; i < checkBoxArray.length; i++) {
//        if (checkBoxArray[i].checked) {
//            checkBoxChecked.push(checkBoxArray[i]);
//        }
//    }
//    return checkBoxChecked;
//}

//Filter by Party Option 2:
if (page == "senate") {
    var checkBoxIdArray = ["checkBoxD", "checkBoxR", "checkBoxI"];
    var checkBox = [];
    var trClassArrayParty = ["D", "R", "I"];
    var trParty = [];
    for (var j = 0; j < checkBoxIdArray.length; j++) {
        checkBox.push(document.getElementById(checkBoxIdArray[j]));
        trParty.push(document.getElementsByClassName(trClassArrayParty[j]));
    }

    for (j = 0; j < checkBox.length; j++) {
        checkBox[j].onchange = function () {
            filterByParty()
        }
    }
}

function filterByParty() {
    var checkBoxChecked = detectCheckBoxChecked(checkBox);
    if (checkBoxChecked.length == 0 || checkBoxChecked.length == checkBox.length) {
        for (var i = 0; i < trParty.length; i++) {
            for (var j = 0; j < trParty[i].length; j++) {
                trParty[i][j].style.display = "table-row";
            }
        }
    } else {
        for (var k = 0; k < trParty.length; k++) {
            for (var l = 0; l < trParty[k].length; l++) {
                trParty[k][l].style.display = "none";
            }
        }
        for (var m = 0; m < checkBoxIdArray.length; m++) { //loop id checkbox
            for (var n = 0; n < checkBoxChecked.length; n++) { //loop id checkboxChecked
                if (checkBoxIdArray[m] == checkBoxChecked[n].id) {
                    for (var p = 0; p < trParty[m].length; p++) {
                        trParty[m][p].style.display = "table-row";
                    }
                }
            }
        }
    }
}

function detectCheckBoxChecked(checkBoxArray) {
    var checkBoxChecked = [];
    for (var i = 0; i < checkBoxArray.length; i++) {
        if (checkBoxArray[i].checked) {
            checkBoxChecked.push(checkBoxArray[i]);
        }
    }
    return checkBoxChecked;
}

//Filter by State:
if (page == "senate") {
    var trClassArrayState = listStates(membersArray);
    var trState = [];
    for (var k = 0; k < trClassArrayState.length; k++) {
        trState.push(document.getElementsByClassName(trClassArrayState[k]));
    }
    var select = document.getElementsByTagName("select");
    select[0].onchange = function () {
        FilterByState(this.value)
    }
}

function FilterByState(stateSelected) {
    var i,
        j;
    if (stateSelected == "Select") {
        for (i = 0; trState.length; i++) {
            for (j = 0; j < trState[i].length; j++) {
                trState[i][j].style.display = "table-row";
            }
        }
    } else {
        for (i = 0; i<trState.length; i++) {
            if (trState[i][0].className.split(" ")[1] != stateSelected) {
                for (j = 0; j < trState[i].length; j++) {
                    trState[i][j].style.display = "none";
                }
            } else {
                for (j = 0; j < trState[i].length; j++) {
                    trState[i][j].style.display = "table-row";
                }
            }
        }
    }
}
