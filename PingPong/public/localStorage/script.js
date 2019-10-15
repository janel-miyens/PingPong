
var dataSet = [];
var counter = 0;

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

        //console.log(counter, data[1], data[2], data[3], data[4]);

        saveDataSpreadSheet(counter, data[1], data[2], data[3], data[4]);
        return counter;
    }

     function saveDataSpreadSheet(coupon, name, email, score, win){

        console.log(coupon, name, email, score, win);
        
             var values = [
                  [
                      coupon, name, email, score, win
                    // Cell values ...
                  ],
                  // Additional rows ...
                ];

              var body = {
                  values: values
                };

              var parameters = {
                // The ID of the spreadsheet to retrieve data from.
                spreadsheetId: '1Nj_Wum0a1J4i56sQT--WcjT1htwtVdUXIKU1F4n3P_Q',  // TODO: Update placeholder value.

                // The A1 notation of the values to retrieve.
                range: 'Game Report',  // TODO: Update placeholder value.
                valueInputOption: 'RAW',
                resource: body
              };
                
                 gapi.client.sheets.spreadsheets.values.append(parameters).then((response) => {
                  var result = response.result;
                  //console.log(result);
                  
                });
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
