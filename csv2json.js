var c2j;
if(!c2j) {
	c2j = {};
}                

(function () {
    'use strict';

c2j.csv2js = function(csvText) {    
	var csvRows = [];
	var objArr = [];
	var jsonText = "";
	csvRows = this.splitIntoRows(csvText);
	if (csvRows.length < 2) { 
		c2j.error = true; c2j.message = "The CSV text MUST have a header row!"; 
		return {"error": c2j.message}
	}
	var headers = this.parseCSVLine(csvRows.shift());

	var jsonData = [];

	for (var i = 0; i < csvRows.length; i++)
	{
		csvRows[i] = this.parseCSVLine(csvRows[i]);
	}

	for (var i = 0; i < csvRows.length; i++)
	{
		if (csvRows[i].length > 0) jsonData.push({});

		for (var j = 0; j < csvRows[i].length; j++)
		{
			jsonData[i][headers[j]] = csvRows[i][j];
		}
	}                            

	return jsonData; 
}

c2j.csv2json = function(csvText) {   
	var jsonData = this.csv2js(csvText);
	
	var jsonText = JSON.stringify(jsonData, null, "\t");

	return jsonText; 
}

c2j.splitIntoRows = function(csvData) {
	var csvRows = csvData.split(/[\r\n]/g); // split into rows
	
	// get rid of empty rows
	for (var i = 0; i < csvRows.length; i++)
	{
		if (csvRows[i].replace(/^[\s]*|[\s]*$/g, '') == "")
		{
			csvRows.splice(i, 1);
			i--;
		}
	}   
	return csvRows;
}

c2j.parseCSVLine = function(line)
{
	line = line.split(',');
	
	// check for splits performed inside quoted strings and correct if needed
	for (var i = 0; i < line.length; i++)
	{
		var chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
		var quote = "";
		if (chunk.charAt(0) == '"' || chunk.charAt(0) == "'") quote = chunk.charAt(0);
		if (quote != "" && chunk.charAt(chunk.length - 1) == quote) quote = "";
		
		if (quote != "")
		{
			var j = i + 1;
			
			if (j < line.length) chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");
			
			while (j < line.length && chunk.charAt(chunk.length - 1) != quote)
			{
				line[i] += ',' + line[j];
				line.splice(j, 1);
				chunk = line[j].replace(/[\s]*$/g, "");
			}
			
			if (j < line.length)
			{
				line[i] += ',' + line[j];
				line.splice(j, 1);
			}
		}
	}
	
	for (var i = 0; i < line.length; i++)
	{
		// remove leading/trailing whitespace
		line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");
		
		// remove leading/trailing quotes
		if (line[i].charAt(0) == '"') line[i] = line[i].replace(/^"|"$/g, "");
		else if (line[i].charAt(0) == "'") line[i] = line[i].replace(/^'|'$/g, "");
	}
	
	return line;
}
 
}());

  
