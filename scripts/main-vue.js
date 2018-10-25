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
        someTR: true,
        loading: true
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
                    app.dropDownMenuStates();
                    app.loading = false;
                })
        },
        dropDownMenuStates: function () {
            //INCLUDES
//            for (var i = 0; i < this.members.length; i++) {
//                if (!this.states.includes(this.members[i].state)) {
//                    this.states.push(this.members[i].state);
//                }
//            }
//            this.states.sort();

            //MAP, NEW SET, ARRAY.FROM
            var allStates = this.members.map(function (member) {
                return member.state;
            })
            this.states = Array.from(new Set(allStates)).sort();
        },
        memberFulfilFilters: function (member) {
            return (this.filterState == 'All' || member.state == this.filterState) && (this.filterParty.length == 0 || this.filterParty.includes(member.party));
        }
    },
    created: function () {
        this.startFetch(this.url);
    },
    updated: function () {
        this.someTR = (Array.from(document.getElementById("congress-data").children).length !== 0);
    }
})
