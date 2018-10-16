/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global$ */

var arrayNumber = [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6, 7, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 40, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 50, 60, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 80, 80, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 100, 0, 0];
arrayNumber = arrayNumber.sort(function () {
    return Math.random() - 0.5
});

function smallestsByPersentageNoSort(array, persentage) {
    var smallestArray = [];
    var posSmallestArray = [];
    var largestOfSmallest = -1;
    var candidate = array[0];
    var smallestsCandidates = [];
    var posSmallestsCandidates = [];
    var isFirstLoop = true;
    if (persentage > 100) {
        persentage = 100;
    }

    var actualPersentage = 0;
    while (actualPersentage < persentage) {
        if (!isFirstLoop) {
            var previousCandidate = candidate;
            var k = 0;
            while (candidate <= previousCandidate) {
                candidate = array[k];
                k++;
            }
        }

        for (var i = 0; i < array.length; i++) {
            if (array[i] == candidate) {
                smallestsCandidates.push(array[i]);
                posSmallestsCandidates.push(i);
            } else if (array[i] > largestOfSmallest && array[i] < candidate) {
                smallestsCandidates = [array[i]];
                posSmallestsCandidates = [i];
                candidate = array[i];
            }
        }

        for (var j = 0; j < smallestsCandidates.length; j++) {
            smallestArray.push(smallestsCandidates[j]);
            posSmallestArray.push(posSmallestsCandidates[j]);
        }
        largestOfSmallest = smallestsCandidates[0];
        smallestsCandidates = [];
        if (isFirstLoop) {
            isFirstLoop = false;
        }

        actualPersentage = (smallestArray.length / array.length) * 100;
    }

    console.log(array)
    console.log(smallestArray);
    console.log(posSmallestArray);
}

function smallestsByPersentage(array, persentage) {
    array.sort(function (a, b) {
        return a - b;
    });
    var i = 0;
    var actualPersentage = 0;
    while (actualPersentage < persentage) {
        var lowest = array[i];
        while (array[i] == lowest) {
            i++;
        }
        actualPersentage = (i / array.length) * 100;
    }

    var arraySmallest = [];
    for (var j = 0; j < i; j++) {
        arraySmallest.push(array[j]);
    }
    console.log(array);
    console.log(arraySmallest);
}


smallestsByPersentageNoSort(arrayNumber, 10);
smallestsByPersentage(arrayNumber, 10);
