/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

var app = new Vue({
    el: "#app",
    data: {
        url: null,
        members: null,
        states: [],
        filterParty: [],
        filterState: "All",
        someTR: true,
        loading: true
    },
    methods: {
        selectUrl: function () {
            var page = document.querySelector('[data-page]').dataset.page;
            if (page == "senate-data") {
                this.url = "https://api.propublica.org/congress/v1/113/senate/members.json";
            } else if (page == "house-data") {
                this.url = "https://api.propublica.org/congress/v1/113/house/members.json";
            }
        },
        startFetch: function (url) {
            fetch(url, {
                    method: "GET",
                    headers: {
                        "X-API-Key": "Mav6sG8mZwoWpVesShC3VKYBZtpLKchoGj4UZI49"
                    }
                })
                .then(response => response.json())
                .then(myData => {
                    this.members = myData.results[0].members;
                    this.dropDownMenuStates();
                    this.loading = false;
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
            //            var allStates = this.members.map(function (member) {
            //                return member.state;
            //            })
            //            this.states = Array.from(new Set(allStates)).sort();

            //MAP, NEW SET, SPREAD OPERATOR
            //            var allStates = this.members.map(function (member) {
            //                return member.state;
            //            })
            //            this.states = [... new Set(allStates)].sort();

            //ARROW FUNCTION
            this.states = [...new Set(this.members.map(member => member.state))].sort();
        },
        memberFulfilFilters: function (member) {
            return (this.filterState == 'All' || member.state == this.filterState) && (this.filterParty.length == 0 || this.filterParty.includes(member.party));
        }
    },
    created: function () {
        this.selectUrl();
        this.startFetch(this.url);
    },
    updated: function () {
        this.someTR = (Array.from(document.getElementById("congress-data").children).length !== 0);
    }
})
