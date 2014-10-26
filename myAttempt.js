$.ajaxSetup({ mimeType: "text/plain" }); // to fix the syntax error shown in firefox during csv file import
var awards,contracts; //variables to store raw fetched data
var  ta,tc; 
var total=0; // variable to store the total amount of closed contracts	
var final=new Array(),csvContent; // variables to store the final merged data

$.ajax({                  //ajax request to get the csv file
    type: "GET",
    url: "awards.csv",
    dataType: "text",
    success: function(data) {
			while((data.match(/(".*),(.*")/)||[]).length!=0){     //To check if the received CSV file consists of commas within the data itself
				data=data.replace(/(".*),(.*")/,"$1 xxcommaxx $2");  //replace comma(,) in the data with a temporary data so that the data won't be split into  half 
			}
			awards=data.split(/\n/); //seperating rows of data 
			var l=awards.length;
			for(i=0;i<l;i++){
				awards[i]=awards[i].split(','); //seperating columns of data
				};
			console.log(awards);
           		},
    error: function (request, status, error) {
        		alert("Awards csv file export failed! Cause:"+request.responseText); //if the csv file couldn't be imported error is displayed
    			}
	});
$.ajax({
    type: "GET",
    url: "contracts.csv",
    dataType: "text",
    success: function(data) {
			while((data.match(/(".*),(.*")/)||[]).length!=0){
				data=data.replace(/(".*),(.*")/,"$1 xxcommaxx $2");
			}
			contracts=data.split(/\r\n/);
			var l=contracts.length;
			for(i=0;i<l;i++){
				contracts[i]=contracts[i].split(",");//(?=([^\"]*\"[^\"]*\")*(?![^\"]*\"))");
				};
			console.log(contracts);
           		},
    error: function (request, status, error) {
        		alert("Contracts csv file export failed! Cause:"+request.responseText);
    			}
	});
$( document ).ajaxStop(function() {   //after both the csv files are loaded the following code is executed
	   var j=0;
	   final[0]=contracts[0];  //the header of the contracts is copied to the final data array
	   var temp=awards[0].slice(1);    // the header of awards is copied neglecting the first column which is similar to that of contracts 
	   console.log("temp",temp);
	   temp.forEach(function(item){		
		     final[0].push(item); //then it is added to the final data 
		});
		//console.log(final);
		var atemp=new Array(),ctemp=new Array();   
		for(i=1;i<awards.length;i++){
	    		atemp.push(awards[i].splice(0,1));    //first column elements of awards are seperated from other columns and stored in seperate variables
		}
		for(i=1;i<contracts.length;i++){
	    		ctemp.push(contracts[i].splice(0,1)); 
		}
		var template=new Array(awards.length); //template for adding to contracts which havent been awarded yet
		for(var i=1;i<contracts.length-1;i++){  // for all the contracts the following is carried out
			//console.log("j is",j,"& i is",i);  
			var ta=parseInt(atemp[j].toLocaleString().slice(14));  //the last digits are sliced from the contract name for matching
			var tc=parseInt(ctemp[i-1].toLocaleString().slice(14));
			if(ta==tc){                       // if the contractname is same
				final[i]=$.merge(atemp[j],contracts[i-1+1]);   //then the contract and the award is merged
				final[i]=$.merge(final[i],awards[j+1]);
				if(contracts[i-1+1][0]=="Closed"){      //if the contract is awarded and contract is closed then total is incremented with award amount
					total+=parseInt(awards[j+1][4]);
				}
				//console.log(contracts[i-1+1][1],awards[j+1][4]);
				j++;
				}else{                   // if contract isn't awarded contract is merged with the empty template
				final[i]=$.merge(ctemp[i-1],contracts[i-1+1]);
				final[i]=$.merge(final[i],template);
				}
				};	
	//console.log("FINAL",final);


csvContent = "data:text/csv;charset=utf-8,";      //the csv content type is declared
final.forEach(function(infoArray, index){        //the array is converted into csv format

   dataString = infoArray.join(",");                 
   csvContent += index < infoArray.length ? dataString+ "\n" : dataString;


}); 

while(csvContent.match("xxcommaxx")!=null){   //the previously used temporary variable is replaced back into it's normal form i.e. comma(,)
csvContent=csvContent.replace("xxcommaxx",",");
}
//console.log(csvContent);
var encodedUri = encodeURI(csvContent);
//window.open(encodedUri,final.csv);   this wasn't done as the output filename couldn't be changed with this method !
var downloadLink = document.createElement("a");  
downloadLink.href = encodedUri;
downloadLink.download = "final.csv";   

document.body.appendChild(downloadLink);
downloadLink.click();                   //for exporting the csv file
document.body.removeChild(downloadLink);
//alert("Total Amount of Closed Contracts: "+total);
$("#display").html("Total Amount of Closed Contracts: "+total);    //displaying the total amount of closed contracts
});
