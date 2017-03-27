// Initialize Firebase
var hr = parseInt(moment().format("HH"));
var min = parseInt(moment().format("mm"));
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBy1JpU5jToen0TTnH_CHEUUS5B3dRXieQ",
    authDomain: "hw7-train-schedule.firebaseapp.com",
    databaseURL: "https://hw7-train-schedule.firebaseio.com",
    storageBucket: "hw7-train-schedule.appspot.com",
    messagingSenderId: "811123149709"
};
firebase.initializeApp(config);

var database = firebase.database();
var DEBUG = false;
var ONLOAD = true;

//Initialize timepicker
var timepicker = new TimePicker('time', {
  lang: 'en',
  theme: 'dark'
});
timepicker.on('change', function(evt) {
  
  var value = (evt.hour || '00') + ':' + (evt.minute || '00');
  evt.element.value = value;

});

//button event
$("#myButton").on("click", function (event) {
    event.preventDefault();
    var trainName = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#time").val().trim();
    var frequency = $("#frequency").val().trim();
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"))
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var nextTrainTime = moment(nextTrain).format("HH:mm")
    database.ref().push({
        aName: trainName,
        destination: destination,
        ftt: firstTrainTime,
        frequency: frequency,
        nextTrainTime: nextTrainTime,
        tMinutesTillTrain: tMinutesTillTrain
    });

    $("#name").val('');
    $("#destination").val('');
    $("#time").val('');
    $("#frequency").val('');
});

function buildLine(obj){
    console.log(obj);
    console.log(parseInt(obj.ftt));
    var newTr = $("<tr>");
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && key !== "ftt") {
            var newTd = $("<td>").html(obj[key]);
            newTr.append(newTd);
            console.log(key + " -> " + obj[key])
        }
    }
    $('tbody').prepend(newTr);
}
database.ref().on("value", function(snapshot) {
    //any changes on database we want to update our html

    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Getting an array of each key In the snapshot object
    var svArr = Object.keys(sv);

    // Finding the last user's key
    var lastIndex = svArr.length - 1;

    var lastKey = svArr[lastIndex];

    // Using the last user's key to access the last added user object
    var lastObj = sv[lastKey]

    if(ONLOAD){
        for (var i = 0; i < svArr.length; i++) {
            buildLine(sv[svArr[i]]);
        }
        ONLOAD = false;
    }else {
        buildLine(lastObj);
    }
    // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
