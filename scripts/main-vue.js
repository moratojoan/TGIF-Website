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
        filterState: "All"
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
                    //this is the only place we know we have the data.
                    app.members = myData.results[0].members;
                    app.main()
                })
        },
        main: function () {
            console.log(this.members);
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
            var paramFilterState = this.filterState;
            var memeberFulfilParty = false;
            if (paramFilterParty.length == 0) {
                memeberFulfilParty = true;
            } else if (paramFilterParty.includes(member.party)) {
                memeberFulfilParty = true;
            }

            var memberFulfilState = false;
            if (paramFilterState == "All") {
                memberFulfilState = true;
            } else {
                if (member.state == paramFilterState) {
                    memberFulfilState = true;
                }
            }
            return memeberFulfilParty && memberFulfilState
        },
        updateFilterState: function () {
            //v-model
            var select = document.getElementsByTagName("select")[0];
            this.filterState = select.selectedOptions[0].value;
        },
        updateFilterParty: function () {
            var checkBox = document.getElementsByTagName("input");
            var trId = ["D", "R", "I"];
            this.filterParty = [];
            for (let i = 0; i < checkBox.length; i++) {
                if (checkBox[i].checked) {
                    this.filterParty.push(trId[i]);
                }
            }
        },
        tbodyPlain: function(){
            return document.getElementById("congress-data").firstChild
        }
    },
    created: function () {
        this.startFetch(this.url);
    }
})
