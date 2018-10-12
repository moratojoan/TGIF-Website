/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

var page = document.getElementsByTagName("header")[0].className.split(" ")[0];


if (page == "senate" || page == "house") {
    var data = data;
    var membersArray = data.results[0].members;
    var keysArray = [["url", "first_name", "last_name", "middle_name"], "party", "state", "seniority", "votes_with_party_pct"];
    var filterParty = [];
    var filterState = "Select";
    createTable(membersArray, filterParty, filterState);
    createDropdownMenu(membersArray);
}

function createTable(paramMembersArray, paramFilterParty, paramFilterState) {
    var tbody,
        tr,
        td,
        a,
        i,
        j;
    tbody = document.getElementById("congress-data");

    //Clear tbody
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    //Fill tbody
    for (i = 0; i < paramMembersArray.length; i++) {
        if (memberFulfilFilters(paramMembersArray[i], paramFilterParty, paramFilterState)) {
            tr = document.createElement("tr");
            for (j = 0; j < keysArray.length; j++) {
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
    
    //If there aren't any row added
    if (!tbody.firstChild){
        var p = document.createElement("p");
        p.textContent = "There is no member";
        tbody.appendChild(p);
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

//Filters: CheckBoxes && DropDown
if (page == "senate" || page == "house") {
    var checkBoxClassNameArray = ["checkBoxD", "checkBoxR", "checkBoxI"];
    var checkBox = [];
    for (var j = 0; j < checkBoxClassNameArray.length; j++) {
        checkBox.push(document.getElementsByClassName(checkBoxClassNameArray[j])[0]);
    }

    for (j = 0; j < checkBox.length; j++) {
        checkBox[j].onchange = function () {
            createParamsToCreateTable()
        }
    }


    var select = document.getElementsByTagName("select");
    select[0].onchange = function () {
        createParamsToCreateTable()
    }
}

function createParamsToCreateTable() {
    var trId = ["D", "R", "I"];
    var filterParty = [];
    for (var i = 0; i < checkBox.length; i++) {
        if (checkBox[i].checked) {
            filterParty.push(trId[i]);
        }
    }

    var filterState = select[0].selectedOptions[0].value;

    createTable(membersArray, filterParty, filterState);
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
    
    if (memeberFulfilParty && memberFulfilState){
        return true;
    }else{
        return false;
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
