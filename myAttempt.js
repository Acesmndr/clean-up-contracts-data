$.ajaxSetup({ mimeType: "text/plain" });
var awards,csvContent;
var  ta,tc;
//var atemp=new Array(),ctemp=new Array();   
var total=0;	
var temp;			
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
			console.log((data.match(/"/g)||[]).length);
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
			temp=data;
			while((temp.match(/(".*),(.*")/)||[]).length!=0){
			temp=temp.replace(/(".*),(.*")/,"$1 xxcommaxx $2");
			}
			//var count=((data.match(/\"/g)||[]).length)/2;
			//alert(count);
			//while(count!=0){			
			//var r=/".*,.*"/.exec(temp);
			
			//var s=r[0].replace(",","xxcommaxx");
			//console.log(r[0],s);
			//temp.replace(r[0],s);
			console.log("temp is",temp);
			//count--;
			//}
			//console.log("number is ",data.search("\".*\""));
			contracts=temp.split(/\r\n/);
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
		
		var finalLength=awards.length+contracts.length-2;
		var carr=new Array(7);
		var awarr=new Array(5);
		for(var i=1;i<finalLength;i++){
			var ta=parseInt(atemp[j].toLocaleString().slice(14));
			var tc=parseInt(ctemp[k].toLocaleString().slice(14));
			if(ta==tc){
				console.log("equal");
				finalLength--;
				final[i]=$.merge(atemp[j],contracts[k+1]);
				final[i]=$.merge(final[i],awards[j+1]);
				if(contracts[k+1][0]=="Closed"){
				total+=parseInt(awards[j+1][4]);
				}
				console.log(contracts[k+1][1],awards[j+1][4]);
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
alert("Total Amount of Closed Contracts: "+total);

});
