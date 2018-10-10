/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

var page = document.getElementsByTagName("header")[0].className.split(" ")[0];


if (page == "senate" || page == "house") {
    var data = data;
    var membersArray = data.results[0].members;
    var keysArray = [["url", "first_name", "last_name", "middle_name"], "party", "state", "seniority", "votes_with_party_pct"];
    createTable(membersArray);
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
        tr.setAttribute("class", paramMembersArray[i].party);
        tbody.appendChild(tr);
    }
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


//Filter by Party:
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

if (page == "senate") {
    var checkBoxIdArray = ["checkBoxD", "checkBoxR", "checkBoxI"];
    var checkBox = [];
    var trClassArray = ["D", "R", "I"];
    var tr = [];
    for (var j = 0; j < checkBoxIdArray.length; j++) {
        checkBox.push(document.getElementById(checkBoxIdArray[j]));
        tr.push(document.getElementsByClassName(trClassArray[j]));
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
        for (var k = 0; k < tr.length; k++) {
            for (var l = 0; l < tr[k].length; l++) {
                tr[k][l].style.display = "table-row";
            }
        }
    } else {
        for (var p = 0; p < tr.length; p++) {
            for (var r = 0; r < tr[p].length; r++) {
                tr[p][r].style.display = "none";
            }
        }
        for (var m = 0; m < checkBoxIdArray.length; m++) {
            for (var n = 0; n < checkBoxIdArray.length; n++) {
                if (checkBoxIdArray[m] == checkBoxChecked[n].id) {
                    for (var s = 0; s < tr[m].length; s++) {
                        tr[m][s].style.display = "table-row";
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
