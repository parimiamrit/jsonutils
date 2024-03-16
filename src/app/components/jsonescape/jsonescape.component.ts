import { Component } from '@angular/core';
@Component({
  selector: 'app-jsonescape',
  templateUrl: './jsonescape.component.html',
  styleUrls: ['./jsonescape.component.css']
})



export class JsonescapeComponent {

  errorBool: boolean = false;
  error: string = '';
  outputErrorBool: boolean = false;
  outputError: string = '';
  inputLang: string = 'JSON';
  outputLang: string = 'text/x-java';
  inputdata = '';
  outputdata: Object = '';
  removeEmptySpaces: boolean = false;

  json = {
	Title: 'Type',
	Description: 'A type of product',
	Type: [{'abc':123},{'bcd':true}]
	};


  inputCodeMirrorOptions: any = {
	theme: 'mbo',
	mode: 'application/ld+json',
	lineNumbers: true,
	lineWrapping: false,
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
	width: "auto",
	viewportMargin: Infinity,
  };

  outputCodeMirrorOptions: any = {
	theme: 'mbo',
	viewportMargin: Infinity,
	mode: 'application/ld+json',
	lineNumbers: true,
	lineWrapping: false,
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
    autorefresh: true,
	readonly: true,
	buttons: [{
		hotkey: 'Ctrl-B',
		class: 'bold',
		label: '<strong>B</strong>',
		callback: function (cm: any) {
			var selection = cm.getSelection();
			cm.replaceSelection('**' + selection + '**');
			if (!selection) {
				var cursorPos = cm.getCursor();
				cm.setCursor(cursorPos.line, cursorPos.ch - 2);
			}
		}
	}]
  };


  ngOnInit() {
	this.inputdata = JSON.stringify(this.json, null, 4);
  }


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

  escape() {
	let input;
	if (this.removeEmptySpaces == true) {
		input = this.inputdata.replace(/\s/g,"");
	} else {
		input = this.inputdata;
	}
	this.outputdata = JSON.stringify(input, null);
  }

  unescape() {
	// let input = this.inputdata.replace(/\\/g,"");
	// this.outputdata = JSON.stringify(JSON.parse(input), null, 4);

	let input = this.inputdata.replace(/\\/g,"");
	if (this.removeEmptySpaces == true) {
		this.outputdata  = JSON.stringify(JSON.parse(input))
	} else {
		this.outputdata  = JSON.stringify(JSON.parse(input), null, 4);
	}
  }


  
  

}
