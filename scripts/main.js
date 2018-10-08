/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

var data = data;
var membersArray = data.results[0].members;
var keysArray = ["first_name", "last_name", "middle_name", "party", "state", "seniority", "votes_with_party_pct"];

function createTable(paramMembersArray) {
    var table,
        tr,
        td,
        a;
    table = document.getElementById("senate-data");
    for (var i = 0; i < paramMembersArray.length; i++) {
        tr = document.createElement("tr");
        for (var j = 0; j < keysArray.length; j++) {
            td = document.createElement("td");
            if (j === 0) {
                a = document.createElement("a");
                a.setAttribute("href",paramMembersArray[i]["url"]);
                a.textContent = paramMembersArray[i][keysArray[j]];
                j++;
                a.textContent += " " + paramMembersArray[i][keysArray[j]];
                j++;
                if(paramMembersArray[i][keysArray[j]] != null){
                    a.textContent += " " + paramMembersArray[i]["middle_name"];
                }
                td.appendChild(a);
            } else if (j===6){
                td.textContent = paramMembersArray[i][keysArray[j]] + "%";
            } else {
                td.textContent = paramMembersArray[i][keysArray[j]];
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

createTable(membersArray);
