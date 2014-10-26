$.ajaxSetup({ mimeType: "text/plain" });
var awards,csvContent;
var  ta,tc;
//var atemp=new Array(),ctemp=new Array();   
				
var contracts;
var final=new Array();
for( var i=0; i<13; i++ ) {
  final.push( [] );
}

$.ajax({
    type: "GET",
    url: "awards.csv",
    dataType: "text",
    success: function(data) {
			awards=data.split(/\n/);
			var l=awards.length;
			for(i=0;i<l;i++){
				awards[i]=awards[i].split(',');
				};
			console.log(awards);
           		},
    error: function (request, status, error) {
        		alert("Awards csv file export failed! Cause:"+request.responseText);
    			}
	});
$.ajax({
    type: "GET",
    url: "contracts.csv",
    dataType: "text",
    success: function(data) {
			contracts=data.split(/\r\n/);
			var l=contracts.length;
			for(i=0;i<l;i++){
				contracts[i]=contracts[i].split(',');
				};
			console.log(contracts);
           		},
    error: function (request, status, error) {
        		alert("Contracts csv file export failed! Cause:"+request.responseText);
    			}
	});
$( document ).ajaxStop(function() {

var j=0,k=0;
	   console.log(contracts);	
	   final[0]=contracts[0];
	   var temp=awards[0].slice(1);
	   console.log(temp);
	   temp.forEach(function(item){		
		     final[0].push(item);
		});
		console.log(final);
		var atemp=new Array(),ctemp=new Array();   
		for(i=1;i<awards.length;i++){
	    		atemp.push(awards[i].splice(0,1));
		}
		for(i=1;i<contracts.length;i++){
	    		ctemp.push(contracts[i].splice(0,1));
		}
		
		var finalLength=awards.length+contracts.length-2;
		var carr=new Array(7);
		var awarr=new Array(5);
		for(var i=1;i<finalLength;i++){
			var ta=parseInt(atemp[j].toLocaleString().slice(14));
			var tc=parseInt(ctemp[k].toLocaleString().slice(14));
			if(ta==tc){
				finalLength--;
				final[i]=$.merge(atemp[j],contracts[k+1]);
				final[i]=$.merge(final[i],awards[j+1]);
				j++;
				k++;
				}else{
					if(ta>tc){
						console.log("entered");
						final[i]=$.merge(ctemp[k],contracts[k+1]);
						final[i]=$.merge(final[i],awarr);
						k++;
						}else{
						final[i]=$.merge(atemp[j],awarr);
						final[i]=$.merge(final[i],awards[j+1]);
						j++;
					}};
				};	
	console.log("FINAL",final);


csvContent = "data:text/csv;charset=utf-8,";
final.forEach(function(infoArray, index){

   dataString = infoArray.join(",");
   csvContent += index < infoArray.length ? dataString+ "\n" : dataString;


}); 

var encodedUri = encodeURI(csvContent);
//window.open(encodedUri,final.csv);
var downloadLink = document.createElement("a");
downloadLink.href = encodedUri;
downloadLink.download = "final.csv";

document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);


});
