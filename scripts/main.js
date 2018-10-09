/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

var data = data;
var membersArray = data.results[0].members;
var keysArray = [["url", "first_name", "last_name", "middle_name"], "party", "state", "seniority", "votes_with_party_pct"];

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
                a.setAttribute("href",paramMembersArray[i][keysArray[j][0]]);
                a.setAttribute("target","_blank");
                a.textContent = paramMembersArray[i][keysArray[j][1]];
                a.textContent += " " + paramMembersArray[i][keysArray[j][2]];
                if(paramMembersArray[i][keysArray[j][3]] != null){
                    a.textContent += " " + paramMembersArray[i][keysArray[j][3]];
                }
                td.appendChild(a);
            } else if (j===keysArray.length-1){
                td.textContent = paramMembersArray[i][keysArray[j]] + "%";
            } else {
                td.textContent = paramMembersArray[i][keysArray[j]];
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}

createTable(membersArray);
