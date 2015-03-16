(function(){
	'use strict';


	var fs = require('fs');
	var minimist = require('minimist')(process.argv);
	var params = minimist._.slice(2);
	var featureText = '';
	var features = [];
	var lastVerb = '';
	var scenario;
	var functions = [];

	var Scenario = function(){
		this.name;
		this.steps = [];
	}

	var createTestFile = function(){

		fs.readFile('./templates/template.js','UTF-8',function(err,data){
			var codeArr = [],
				path = 'automation_tests/tests/'+params[0]+'.js';
			if(err){
				console.error(err);
				return false;
			}
			//console.log(functions);
			codeArr = data.split('//main function body');
			codeArr = [codeArr[0],functions,codeArr[1]].join('');
			
			fs.readFile(path,'UTF-8',function(data){
				if(!err){
					fs.writeFile(path,codeArr);
				}else{
					console.error('file: '+path+' already exists');
				}
			})
		});
	}



	var getFeatureFile = function(){

		var path = 'automation_tests/features/'+params[0]+'.feature';
		var testFilePath = 'automation_tests/tests/'+params[0]+'.js';
		fs.readFile(testFilePath,'UTF-8',function(err,data){
			if(err === null){
				console.error(testFilePath + " already exists");
			}
		});

		fs.readFile(path,'UTF-8',function(err,data){
			if(err && err.code && err.code === 'ENOENT'){
				console.error("There is not such file in the automation_tests/features directory")
				return false;
			}else if(!err){
				featureText = data;
				parseFeautures();
			}
		});
	}

	

	var parseFeautures = function(){

		var lines = featureText.split("\n");
		lines.forEach(function(line,e){

			if(line.search("Scenario") > -1){
				if(scenario){
					features.push(scenario);
					scenario = new Scenario();
				}else{
					scenario = new Scenario();
				}
				scenario.name = cleanString(line.split('Scenario')[1]);

			}
			if(line.search('Given') > -1){
				
				lastVerb = 'given';
				scenario.steps.push({'given':cleanString(line.split('Given')[1])});
				 
			}
			if(line.search('And') > -1){

				var step = {};
				step[lastVerb] = cleanString(line.split('And')[1])
				scenario.steps.push(step);
			}

			if(line.search('When') > -1){
				lastVerb = 'when';
				scenario.steps.push({'when':cleanString(line.split('When')[1])})
			}

			if(line.search('Then') > -1){
				lastVerb = 'then';
				scenario.steps.push({'then':cleanString(line.split('Then')[1])})
			}
			
		})
		if(scenario){
			features.push(scenario);
			
			scenario = false;
			generateCode();
		}
	}

	

	function cleanString(string){
		return string.replace('\r','').replace(' ','').replace(':','');
	}

	function generateCode(){
		features.forEach(function(feature,i){
			functions.push('\n\t library');
			feature.steps.forEach(function(step,k){
				var verb = Object.keys(step)[0];
				var func = '\n\n\t\t'+'.'+verb+'('+"'"+step[verb]+"'"+',function(){\n\t\t})';
		
				if(k === feature.steps.length-1){
					func = func+"\n\n"
				}

				functions.push(func);
			});
		});

		functions = functions.join('');	
		console.log(functions)
		createTestFile();

	}

	getFeatureFile();
		
}());