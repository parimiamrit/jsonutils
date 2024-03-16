import {Component, OnInit, ViewChild} from '@angular/core';
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
import JsonToTS from "json-to-ts";
import {CodemirrorComponent} from "@ctrl/ngx-codemirror";
import * as CodeMirror from 'codemirror';
import {DiffEditorModel} from "ngx-monaco-editor";

@Component({
  selector: 'app-jsondiff',
  templateUrl: './jsondiff.component.html',
  styleUrls: ['./jsondiff.component.css']
})
export class JsondiffComponent implements OnInit{
  @ViewChild('inputcodemirror') inputCodeMirror: CodemirrorComponent;
  @ViewChild('outputcodemirror') outputCodeMirror: CodemirrorComponent;
  @ViewChild('diffeditor') diffEditor: DiffEditorModel;

  errorBool: boolean = false;
  error: string = '';
  outputErrorBool: boolean = false;
  outputError: string = '';
  inputLang: string = 'JSON';
  outputLang: string = 'application/ld+json';
  inputdata = '';
  outputdata = '';

  json1 = {
    Title: 'Type',
    Description: 'A type of product',
    Type: [{'abc':123},{'bcd':true}]};

  json2 = {
    Title: 'DifferentType',
    DifferentDescription: 'A type of product',
    Type: [{'abc':123},{'bcd':true}]};


  diffOptions = { theme: "vs-dark", language: "json", readOnly: true, renderSideBySide: true ,
  scrollbar: {
    // alwaysConsumeMouseWheel: false,
    useShadows: false,
    verticalHasArrows: true,
    horizontalHasArrows: true,
    vertical: 'hidden',
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 17,
    arrowSize: 30
  }};
  originalModel: DiffEditorModel = {
    code: '',
    language: 'json'
  };
  modifiedModel: DiffEditorModel = {
    code: '',
    language: 'json'
  };


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
    indentWithTabs: true,
    autorefresh: true
  };


  constructor(private router:Router) {

  }


  ngOnInit() {
    this.inputdata = JSON.stringify(this.json1, null, 4);
    this.outputdata = JSON.stringify(this.json2, null, 4);
    this.calculateDiff();
  }

  beautifyInputContent() {
    try {
      this.json1 = JSON.parse(this.inputdata);
      this.inputdata = JSON.stringify(this.json1, null, 4).replaceAll('    ','\t');
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
      this.json1 = JSON.parse(this.inputdata);
      this.error = '';
      this.errorBool = false;
      return this.json1;
    } catch (error) {
      if (typeof error === "string") {
        this.error = error.toUpperCase() // works, `e` narrowed to string
        return this.json1;
      } else if (error instanceof Error) {
        this.error = error.message // works, `e` narrowed to Error
        return this.json1;
      }
    }
    return this.json1;
  }

  beautifyOutputContent() {
    try {
      this.json2 = JSON.parse(this.outputdata);
      this.outputdata = JSON.stringify(this.json2, null, 4).replaceAll('    ','\t');
      this.outputError = '';
      this.outputErrorBool = false;
    } catch (error) {
      if (typeof error === "string") {
        this.outputError = error.toUpperCase()
      } else if (error instanceof Error) {
        this.outputError = error.message
      }
    }

  }

  changeOutputEditorOption(value: string) {
    this.outputCodeMirrorOptions.mode = value;
    this.calculateDiff();
    console.log(this.outputCodeMirrorOptions.mode)
  }

  calculateDiff() {
    this.originalModel = Object.assign({}, this.originalModel, {code: this.inputdata});
    // this.originalModel.code = this.inputdata;
    this.modifiedModel = Object.assign({}, this.originalModel, { code: this.outputdata });
    // this.modifiedModel.code = this.outputdata;
  }

}
