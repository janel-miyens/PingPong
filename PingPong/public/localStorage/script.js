
var dataSet = [];
var counter = 0;

$(document).ready(function() {

    //localStorage.clear();
    
        //load data first
        dataSet = loadData();

        if(dataSet.length == 0){
            counter = 1;
        }
        else{
            counter = dataSet.length;
            counter++;
        }
 
} );


    function addAndSaveData(data){

        //load data first
        dataSet = loadData();

        if(dataSet.length == 0){
            counter = 1;
        }
        else{
            counter = dataSet.length;
            counter++;
        }

        saveData(addData(dataSet, [counter, data[1], data[2], data[3], data[4]] ) );
        return counter;
    }

    //saveData(addData(dataSet, [counter,"janel2","sample2@email.com", 50, "maybe"]));

    function addData(dataArray, array){
        dataArray.push(array);

        return dataArray;
    }

    function saveData(data){
        try {
          localStorage["players"] = JSON.stringify(data);
        } catch (e) {
          //alert("Error when writing to Local Storage\n" + e);
          console.log("Error when writing to Local Storage\n" + e) ; 
        }
    }

    function loadData(){

        var loadData = [];

        try {
          loadData = JSON.parse( localStorage["players"]);
        } catch (e) {
          //alert("Error when reading from Local Storage\n" + e);
          console.log("Error when reading from Local Storage\n" + e) ;       
        }

        return loadData;
    }