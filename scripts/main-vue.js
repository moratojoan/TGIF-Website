/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

var app = new Vue({
    el: "#app",
    data: {
        url: "https://api.propublica.org/congress/v1/113/senate/members.json",
        members: null,
        states: [],
        filterParty: [],
        filterState: "All",
        anyTR: true
    },
    methods: {
        startFetch: function (url) {
            fetch(url, {
                    method: "GET",
                    headers: {
                        "X-API-Key": "Mav6sG8mZwoWpVesShC3VKYBZtpLKchoGj4UZI49"
                    }
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (myData) {
                    app.members = myData.results[0].members;
                    app.main()
                })
        },
        main: function () {
            this.dropDownMenuStates();
            document.getElementsByClassName("lds-spinner")[0].style.display = "none";
            document.getElementsByClassName("loadContent")[0].style.display = "block";
        },
        dropDownMenuStates: function () {
            for (let i = 0; i < this.members.length; i++) {
                if (!this.states.includes(this.members[i].state)) {
                    this.states.push(this.members[i].state);
                }
            }
            this.states.sort();
        },
        memberFulfilFilters: function (member) {
            var paramFilterParty = this.filterParty;
//            var paramFilterState = this.filterState;
            var memeberFulfilParty = false;
//            var memberFulfilState = false;
            
            if (paramFilterParty.length == 0) {
                memeberFulfilParty = true;
            } else if (paramFilterParty.includes(member.party)) {
                memeberFulfilParty = true;
            }

//            if (paramFilterState == "All") {
//                memberFulfilState = true;
//            } else {
//                if (member.state == paramFilterState) {
//                    memberFulfilState = true;
//                }
//            }
//            return memeberFulfilParty && memberFulfilState
            return memeberFulfilParty;
        }
    },
    created: function () {
        this.startFetch(this.url);
    },
    updated: function () {
        var arrayTbodyChildNodes = Array.from(document.getElementById("congress-data").childNodes);
        var anyTRUpdate = false;
        arrayTbodyChildNodes.map(function (child) {
            if (child.nodeName == "TR") {
                anyTRUpdate = true;
            }
        });
        this.anyTR = anyTRUpdate;
    }
})
