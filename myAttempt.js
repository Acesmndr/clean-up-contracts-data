$.ajaxSetup({ mimeType: "text/plain" });
var awards,csvContent;
var  ta,tc;
//var atemp=new Array(),ctemp=new Array();   
var total=0;	
var temp;			
var contracts;
var final=new Array();

$.ajax({
    type: "GET",
    url: "awards.csv",
    dataType: "text",
    success: function(data) {
			while((data.match(/(".*),(.*")/)||[]).length!=0){
				data=data.replace(/(".*),(.*")/,"$1 xxcommaxx $2");
			}
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
		var template=new Array(awards.length);
		for(var i=1;i<contracts.length-1;i++){
			console.log("j is",j,"& i is",i);
			var ta=parseInt(atemp[j].toLocaleString().slice(14));
			var tc=parseInt(ctemp[i-1].toLocaleString().slice(14));
			if(ta==tc){
				console.log("equal");
				final[i]=$.merge(atemp[j],contracts[i-1+1]);
				final[i]=$.merge(final[i],awards[j+1]);
				if(contracts[i-1+1][0]=="Closed"){
					total+=parseInt(awards[j+1][4]);
				}
				console.log(contracts[i-1+1][1],awards[j+1][4]);
				j++;
				}else{
				final[i]=$.merge(ctemp[i-1],contracts[i-1+1]);
				final[i]=$.merge(final[i],template);
				}
				};	
	console.log("FINAL",final);


csvContent = "data:text/csv;charset=utf-8,";
final.forEach(function(infoArray, index){

   dataString = infoArray.join(",");
   csvContent += index < infoArray.length ? dataString+ "\n" : dataString;


}); 

while(csvContent.match("xxcommaxx")!=null){
csvContent=csvContent.replace("xxcommaxx",",");
}
console.log(csvContent);
var encodedUri = encodeURI(csvContent);
//window.open(encodedUri,final.csv);
var downloadLink = document.createElement("a");
downloadLink.href = encodedUri;
downloadLink.download = "final.csv";

document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);
//alert("Total Amount of Closed Contracts: "+total);
$("#display").html("Total Amount of Closed Contracts: "+total);
});
