import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/lib/codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/lint/lint';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import JsonToTS from 'json-to-ts';

interface JavaOptions {
	'Imports': boolean,
    'Data': boolean,
    'JsonIgnore': boolean,
    'JsonProperty': boolean,
    'JsonPropertyOrder': boolean,
    'JsonIncludeNonNull': boolean,
    'Serializable': boolean
};

interface PythonOptions {
	'Imports': boolean
};

interface TSOptions {
	'Imports': boolean
};

@Component({
  selector: 'app-json2class',
  templateUrl: './json2class.component.html',
  styleUrls: ['./json2class.component.css']
})
export class Json2classComponent {

  errorBool: boolean = false;
  error: string = '';
  outputErrorBool: boolean = false;
  outputError: string = '';
  inputLang: string = 'JSON';
  outputLang: string = 'text/x-java';
  inputdata = '';
  outputdata = '';
//   nextObject = '\n\n';
  nextObject = '\n-------------------------------------------------\n\n';
  tsToJava = new Map<string, string>([
    ['number','Long'],
    ['string','String'],
    ['boolean','Boolean'],
	['any','String']
  ])
  tsToPython = new Map<string, string>([
    ['number','float'],
    ['string','str'],
    ['boolean','bool'],
	['any','str']
  ])

  javaOptions: JavaOptions = {
    'Imports': true,
    'Data': true,
    'JsonIgnore': true,
    'JsonProperty': true,
    'JsonPropertyOrder': false,
    'JsonIncludeNonNull': false,
    'Serializable': false
  };
  javaStatements = {
    'Data': {import:'import lombok.Data;\n',usage:'@Data\n'},
    'JsonIgnore': {import:'import com.fasterxml.jackson.annotation.JsonIgnoreProperties;\n',usage:'@JsonIgnoreProperties(ignoreUnknown = true)\n'},
    'JsonProperty': {import:'import com.fasterxml.jackson.annotation.JsonProperty;\n',usage:'\t@JsonProperty("varName")\n'},
    'JsonPropertyOrder': {import:'import com.fasterxml.jackson.annotation.JsonPropertyOrder;\n',usage:'@JsonPropertyOrder("")\n'},
    'JsonIncludeNonNull': {import:'import com.fasterxml.jackson.annotation.JsonInclude;\n',usage:'@JsonInclude(JsonInclude.Include.NON_NULL)\n'},
    'Serializable': {import:'import java.io.Serializable;\n',usage:' implements Serializable '}
  };
  tsOptions: TSOptions = {
	'Imports': false
  };
  pythonOptions: PythonOptions = {
	'Imports': true
  }
  pythonStatements = {
	'BaseModel': {import:'from pydantic import BaseModel, Field\n'}
  }

  json = {
	Title: 'Type',
	Description: 'A type of product',
	Type: [{'abc':123},{'bcd':true}]};


  inputCodeMirrorOptions: any = {
	theme: 'mbo',
	mode: 'application/ld+json',
	lineNumbers: true,
	lineWrapping: true,
	foldGutter: true,
	smartIndent: true,
	tabSize: 4,
	indentUnit: 4,
	autofocus: true,
	autocorrect: false,
	gutters: [
	  'CodeMirror-linenumbers',
	  'CodeMirror-foldgutter',
	  'CodeMirror-lint-markers',
	],
	autoCloseBrackets: true,
	matchBrackets: true,
	lint: true,
	outerHeight: "auto",
	innerHeight: "auto",
	height: "auto",
	width: "auto"
  };

  outputCodeMirrorOptions: any = {
	theme: 'mbo', // mbo
	mode: 'text/x-java',
	lineNumbers: true,
	lineWrapping: true,
	foldGutter: true,
	smartIndent: true,
	tabSize: 4,
	indentUnit: 4,
	autofocus: true,
	autocorrect: false,
	gutters: [
	  'CodeMirror-linenumbers',
	  'CodeMirror-foldgutter',
	  'CodeMirror-lint-markers',
	],
	autoCloseBrackets: true,
	matchBrackets: true,
	indentWithTabs: true,
    autorefresh: true
  };


  constructor(private router:Router) {

  }


  ngOnInit() {
	this.inputdata = JSON.stringify(this.json, null, 4);
  }

  setEditorContent(event: any) {
  }

//   changeJavaOptions(key: string, value: boolean) {
// 	for (const i of Object.keys(this.javaOptions)){
// 		if (i === key){
// 			this.javaOptions.$ = value;
// 		}
// 	}
//   }

  beautifyInputContent() {
	try {
	  this.json = JSON.parse(this.inputdata);
	  this.inputdata = JSON.stringify(this.json, null, 4).replaceAll('    ','\t');
	  this.error = '';
	  this.errorBool = false;
	} catch (error) {
	  if (typeof error === "string") {
		this.error = error.toUpperCase()
	} else if (error instanceof Error) {
		this.error = error.message
	}
	}
	
  }

  private getJSONFromData(data: string) {
	try {
	  this.json = JSON.parse(this.inputdata);
	  this.error = '';
	  this.errorBool = false;
	  return this.json;
	} catch (error) {
	  if (typeof error === "string") {
		this.error = error.toUpperCase() // works, `e` narrowed to string
		return this.json;
	  } else if (error instanceof Error) {
		this.error = error.message // works, `e` narrowed to Error
		return this.json;
	  }
	}
	return this.json;
  }

  beautifyOutputContent() {
	// this.inputdata = JSON.stringify(this.getJSONFromData(this.inputdata), null, 4);
  }

  changeOutputEditorOption(value: string) {
	this.outputCodeMirrorOptions.mode = value;
    this.convertToClass();
	console.log(this.outputCodeMirrorOptions.mode)
  }

  convertToClass() {
	console.log(this.javaOptions)
	this.beautifyInputContent();
	var text = '';
	this.outputdata = '';

    JsonToTS(this.json).forEach( typeInterface => {
		text += typeInterface;
		text += '\n\n';
	})
    
	// TS
	if (this.outputLang == 'application/typescript') {
	  this.outputdata = text.replaceAll('  ', '\t');
	}
	// Java
	else if (this.outputLang == 'text/x-java') {
	  var l = text.split('\n\n');
	  for (let i=0; i<l.length-1; i++) {
		var lines = l[i].split('\n');

        var className = lines[0].split(' ')[1];
		this.includeJavaOptions();
		if (this.javaOptions.Serializable === true) {
			this.outputdata += `public class ${className} implements Serializable {\n`;
		}
		else {
			this.outputdata += `public class ${className} {\n`;
		}
		for (let j = 1; j < lines.length-1; j++) {
            lines[j] = lines[j].replace(';','');
			const line = lines[j].split(': ');
            let varType = line[1].replaceAll(' ','');
            let varName = line[0].replaceAll(' ','').replaceAll('?','');
            if (this.tsToJava.has(varType)) {
                varType = this.tsToJava.get(varType)!;
            }
            if (varType.slice(-2) == '[]') {
				if (this.javaOptions.JsonProperty === true) {
					var temp = this.javaStatements.JsonProperty.usage;
    				this.outputdata += temp.replace('varName', varName);
					if (varName[0] === varName[0].toUpperCase()) {
						varName = varName[0].toLowerCase() + varName.substring(1);
					}
					this.outputdata += `\tprivate List<${varType.replaceAll('[]','')}> ${varName};\n`;
				}
				else {
					if (varName[0] === varName[0].toUpperCase()) {
						varName = varName[0].toLowerCase() + varName.substring(1);
					}
					this.outputdata += `\tprivate List<${varType.replaceAll('[]','')}> ${varName};\n`;
				}
            }
            else {
				if (this.javaOptions.JsonProperty === true) {
					var temp = this.javaStatements.JsonProperty.usage;
    				this.outputdata += temp.replace('varName', varName);
					if (varName[0] === varName[0].toUpperCase()) {
						varName = varName[0].toLowerCase() + varName.substring(1);
					}
					this.outputdata += `\tprivate ${varType} ${varName};\n`;
				}
				else {
					if (varName[0] === varName[0].toUpperCase()) {
						varName = varName[0].toLowerCase() + varName.substring(1);
					}
					this.outputdata += `\tprivate ${varType} ${varName};\n`;
				}
            }
		}
        this.outputdata += '}\n';
		this.outputdata += this.nextObject;
	  }
	}
	else if (this.outputLang == 'text/x-python') {
		var l = text.split('\n\n');
		this.includePythonOptions();
		for (let i=0; i<l.length-1; i++) {
		  var lines = l[i].split('\n');
  
		  var className = lines[0].split(' ')[1];
		  this.outputdata += `class ${className}(BaseModel):\n`;
		  for (let j = 1; j < lines.length-1; j++) {
			  lines[j] = lines[j].replace(';','');
			  const line = lines[j].split(': ');
			  let varType = line[1].replaceAll(' ','');
			  let varName = line[0].replaceAll(' ','');
			  if (this.tsToPython.has(varType)) {
				  varType = this.tsToPython.get(varType)!;
			  }
			  if (varType.slice(-2) == '[]') {
				if (varName[0] === varName[0].toUpperCase()) {
					varName = varName[0].toLowerCase() + varName.substring(1);
				}
				if (varName.slice(-1) === '?') {
					this.outputdata += `\t${varName.replaceAll('?','')}: list(${varType.replaceAll('[]','')}) | None = None\n`;
				}
				else {
					this.outputdata += `\t${varName}: list(${varType.replaceAll('[]','')})\n`;
				}
			  }
			  else {
				if (varName[0] === varName[0].toUpperCase()) {
					varName = varName[0].toLowerCase() + varName.substring(1);
				}
				if (varName.slice(-1) === '?') {
					this.outputdata += `\t${varName.replaceAll('?','')}: ${varType} | None = None\n`;
				}
				else {
					this.outputdata += `\t${varName}: ${varType}\n`;
				}
			  }
		  }
		  this.outputdata += '\n';
		//   this.outputdata += this.nextObject;
		}
	}
  }

  includeJavaOptions() {
	if (this.javaOptions.Imports === true) {
		if (this.javaOptions.Data === true) {
			this.outputdata += `${this.javaStatements.Data.import}`
		}
		if (this.javaOptions.JsonIgnore === true) {
			this.outputdata += `${this.javaStatements.JsonIgnore.import}`
		}
		if (this.javaOptions.JsonProperty === true) {
			this.outputdata += `${this.javaStatements.JsonProperty.import}`
		}
		if (this.javaOptions.JsonPropertyOrder === true) {
			this.outputdata += `${this.javaStatements.JsonPropertyOrder.import}`
		}
		if (this.javaOptions.JsonIncludeNonNull === true) {
			this.outputdata += `${this.javaStatements.JsonIncludeNonNull.import}`
		}
		if (this.javaOptions.Serializable === true) {
			this.outputdata += `${this.javaStatements.Serializable.import}`
		}
		this.outputdata += '\n';
	}
	
	if (this.javaOptions.Data === true) {
		this.outputdata += `${this.javaStatements.Data.usage}`
	}
	if (this.javaOptions.JsonIgnore === true) {
		this.outputdata += `${this.javaStatements.JsonIgnore.usage}`
	}
	if (this.javaOptions.JsonIncludeNonNull === true) {
		this.outputdata += `${this.javaStatements.JsonIncludeNonNull.usage}`
	}

  }

  includePythonOptions() {
	if (this.pythonOptions.Imports === true) {
		this.outputdata += `${this.pythonStatements.BaseModel.import}`
	}
	this.outputdata += '\n';
  }

}
