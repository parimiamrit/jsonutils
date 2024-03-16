import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatChipOption } from '@angular/material/chips';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatTableDataSource } from '@angular/material/table';
import { isArray } from 'jquery';

interface TreeData {
  name: string;
  path?: string;
  pathlist?: string[];
  children?: TreeData[];
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function unCapitalizeFirstLetter(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}


@Component({
  selector: 'app-json-mapping-helper',
  templateUrl: './json-mapping-helper.component.html',
  styleUrls: ['./json-mapping-helper.component.css'],
})

export class JsonMappingHelperComponent implements OnInit {
  @ViewChild('chipContainer', { read: ViewContainerRef })
  chipContainer!: ViewContainerRef;
  inputtreeControl = new NestedTreeControl<TreeData>(node => node.children);
  inputdataSource = new MatTreeNestedDataSource<TreeData>();
  outputtreeControl = new NestedTreeControl<TreeData>(node => node.children);
  outputdataSource = new MatTreeNestedDataSource<TreeData>();
  mappingDataSource = new MatTableDataSource<any>();

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

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

  inputjson: any = {
    Title: 'Type',
    Description: 'A type of product',
    Type: [{ 'abc': 123 }, { 'bcd': true }],
    newList: [234, 345]
  };

  inputprocessedjson: any = {};
  outputprocessedjson: any = {};

  outputjson: any = {
    Title: 'Type',
    Description: 'A type of product',
    Type: [{ 'abc': 123 }, { 'bcd': true }],
    newList: [234, 345]
  };

  configs: any = {
    id_field: 'id',
    parent_id_field: 'parent',
    columns: [
      {
        name: 'key',
        header: 'Key',
      },
      {
        name: 'value',
        header: 'Value',
      }
    ]
  };


  errorBool: boolean = false;
  error: string = '';
  outputErrorBool: boolean = false;
  outputError: string = '';
  inputdata = '';
  outputdata = '';
  inputtreedata: TreeData[];
  outputtreedata: TreeData[];

  inputdatatrie: any;
  outputdatatrie: any;

  inputtooutput: any[] = [];
  mappingdetails: any[] = [];
  // [{0:'a',1:'b'}];
  displayedColumns: string[] = ['Input Field Path', 'Input Field', 'Output Field', 'Output Field Path', 'Delete Row'];
  inputfieldcount = 0
  outputfieldcount = 0

  mappingcode = ''

  ngOnInit() {
    this.inputdata = JSON.stringify(this.inputjson, null, 4);
    this.outputdata = JSON.stringify(this.outputjson, null, 4);
    this.mappingDataSource.data = this.inputtooutput
  }

  hasChild = (_: number, node: TreeData) => !!node.children && node.children.length > 0;

  getType(value: any) {
    return typeof (value);
  }

  removeRow(index: any, element: any) {
    console.log('index',index)
    this.inputtooutput.splice(index,1)
    this.mappingdetails.splice(index, 1)
    this.mappingDataSource.data = this.inputtooutput
    if (element['Input Field'] != '') {
      this.inputfieldcount -= 1
    }
    if (element['Output Field'] != '') {
      this.outputfieldcount -= 1
    }
  }

  resetMappings() {
    this.inputtooutput = []
    this.mappingdetails = []
    this.mappingDataSource.data = this.inputtooutput
  }

  updateInputJson() {
    this.inputprocessedjson = this.inputjson;
    this.inputdata = JSON.stringify(this.inputjson, null, 4);
    this.inputtreedata = [{ 'name': 'root', 'children': [] }]
    console.log('inp', this.inputjson)
    this.updateinputtreedata(this.inputjson, 'root', ['root'], this.inputtreedata[0], false)
    console.log('result = ', this.inputtreedata)
    this.inputdataSource.data = this.inputtreedata
    this.inputtreeControl.dataNodes = this.inputdataSource.data
    this.inputtreeControl.expandAll()
  }

  updateOutputJson() {
    this.outputprocessedjson = this.outputjson;
    this.outputdata = JSON.stringify(this.outputjson, null, 4);
    this.outputtreedata = [{ 'name': 'root', 'children': [] }]
    console.log('out', this.outputjson)
    this.updateoutputtreedata(this.outputjson, 'root', ['root'], this.outputtreedata[0], false)
    console.log('result = ', this.outputtreedata)
    this.outputdataSource.data = this.outputtreedata
    this.outputtreeControl.dataNodes = this.outputdataSource.data
    this.outputtreeControl.expandAll()
  }

  updateinputtreedata(data: any, path: string, pathlist: string[], result: TreeData, isArray: boolean) {
    for (let key of Object.keys(data)) {
      console.log('pathlist: ', key, pathlist, typeof data[key], data[key])
      if (typeof data[key] === 'object' && !(data[key] instanceof Number) && !(data[key] instanceof String) ) {
        let newChild: TreeData = {name: ""};
        let newpath = path;
        let newpathlist = [...pathlist];
        console.log("type: ", data[key], typeof data[key])
        if (isArray) {
          newpathlist.push('$')
          newpath += '[$]';
          newChild = { 'name': key, 'children': [], 'path': newpath, pathlist: newpathlist}
          result['children']?.push(newChild)
          console.log("type: ", key, typeof data[key])
          if (typeof data[key] === 'object') {
            this.updateinputtreedata(data[key], newpath, newpathlist, newChild, Array.isArray(data[key]))
          }
        }
        else {
          newpathlist.push(key);
          newpath += '["' + key + '"]';
          newChild = { 'name': key, 'children': [], 'path': path + newpath, pathlist: newpathlist }
          result['children']?.push(newChild)
          console.log("isarray: ", key, Array.isArray(data[key]))
          this.updateinputtreedata(data[key], newpath, newpathlist, newChild, Array.isArray(data[key]))
        }
      }
      else {
          let newpathlist = [...pathlist];
          newpathlist.push(key);
          let newChild = {'name': key, 'children': [], 'path': path + '["' + key + '"]', 'pathlist': newpathlist}
          result['children']?.push(newChild)
      }
    }
  }
  updateoutputtreedata(data: any, path: string, pathlist: string[], result: TreeData, isArray: boolean) {
    for (let key of Object.keys(data)) {
      console.log('pathlist: ', pathlist)
      if (typeof data[key] === 'object') {
        let newChild: TreeData = {name: ""};
        let newpath = path;
        let newpathlist = [...pathlist];
        if (isArray) {
          newpathlist.push('$')
          newpath += '[$]';
          newChild = { 'name': key, 'children': [], 'path': newpath, pathlist: newpathlist}
        }
        else {
          newpathlist.push(key);
          newpath += '["' + key + '"]';
          newChild = { 'name': key, 'children': [], 'path': path + newpath, pathlist: newpathlist }
        }
        result['children']?.push(newChild)
        this.updateoutputtreedata(data[key], newpath, newpathlist, newChild, Array.isArray(data[key]))
      }
      else {
        let newpathlist = [...pathlist];
        newpathlist.push(key);
        let newChild = { 'name': key, 'children': [], 'path': path + '["' + key + '"]', 'pathlist': newpathlist }
        result['children']?.push(newChild)
      }
    }
  }

  addInputField(node: any) {
    console.log(node)
    if (this.inputfieldcount < this.outputfieldcount) {
      this.inputtooutput[this.inputfieldcount]["Input Field Path"] = node["path"]
      this.inputtooutput[this.inputfieldcount]["Input Field"] = node["name"]
      this.mappingdetails[this.inputfieldcount]["input"] = node
    }
    else {
      this.inputtooutput.push({ "Input Field Path": node["path"], "Input Field": node['name'], 'Output Field': '', 'Output Field Path': '' })
      this.mappingdetails.push({"input": node, "output": {}})
    }
    console.log(this.inputtooutput)
    this.mappingDataSource.data = this.inputtooutput
    this.inputfieldcount += 1
  }
  addOutputField(node: any) {
    console.log(node)
    if (this.outputfieldcount < this.inputfieldcount) {
      this.inputtooutput[this.outputfieldcount]["Output Field Path"] = node["path"]
      this.inputtooutput[this.outputfieldcount]["Output Field"] = node["name"]
      this.mappingdetails[this.outputfieldcount]["output"] = node
    }
    else {
      this.inputtooutput.push({ "Input Field Path": '', "Input Field": '', 'Output Field': node["name"], 'Output Field Path': node['path'] })
      this.mappingdetails.push({"input": {}, "output": node})
    }
    console.log(this.inputtooutput)
    this.mappingDataSource.data = this.inputtooutput
    this.outputfieldcount += 1
  }


  beautifyInputContent() {
    try {
      this.inputjson = JSON.parse(this.inputdata);
      this.inputdata = JSON.stringify(this.inputjson, null, 4).replaceAll('    ', '\t');
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

  beautifyOutputContent() {
    try {
      this.outputjson = JSON.parse(this.outputdata);
      this.outputdata = JSON.stringify(this.outputjson, null, 4).replaceAll('    ', '\t');
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


  generatePythonMappingCode() {
    console.log("mapping details: ", this.mappingdetails)

    this.inputdatatrie = {};
    this.mappingdetails.forEach((mapping) => {
      let currtrie = this.inputdatatrie
      mapping['input']['pathlist'].forEach((key: any) => {
        if (key in currtrie) {
          currtrie = currtrie[key]
        }
        else {
          currtrie[key] = {}
          currtrie = currtrie[key]
        }
      });
    });
    console.log("trie: ", this.inputdatatrie)
  }


  generateMappingCode() {
    console.log(this.mappingdetails);
    this.mappingcode = '';
    let outputClassPath: any = {};
    this.mappingdetails.forEach((mapping) => {
      let currentPath = outputClassPath;
      for (const outputNode of mapping['output']['pathlist'] as string[]) {
        if (!(outputNode in currentPath)) {
          currentPath[outputNode] = {}
        }
        currentPath = currentPath[outputNode]
      }
      currentPath['leafValueInputPath'] = mapping['input']['pathlist']
    })
    console.log("class path:", outputClassPath);

    this.mappingcode = 'Root root = new Root();\n';
    this.generateOutputClassPath(outputClassPath['root'], 'root');
    console.log('mappingcode:\n', this.mappingcode)
  }


  generateOutputClassPath(outputClassPath: any, parentVariableName: string) {
    for (const key of Object.keys(outputClassPath)) {
      if (!('leafValueInputPath' in outputClassPath[key]) && !('$' in outputClassPath[key])) {
        let className = capitalizeFirstLetter(key)
        let variableName = unCapitalizeFirstLetter(key)
        this.mappingcode += (className + ' ' + variableName + ' = new(' + className + ');\n');
        this.generateOutputClassPath(outputClassPath[key], variableName)
        this.mappingcode += (className + ' ' + variableName + ' = new(' + className + ');\n');
      }
      else if ('$' in outputClassPath[key]) {
        let className = capitalizeFirstLetter(key)
        let variableName = unCapitalizeFirstLetter(key)
        //   Create list
        let listVariableName = `${variableName}List`
        this.mappingcode += (`List<${className}> ${listVariableName} = new ArrayList();\n`);
        if (!('leafValueInputPath' in outputClassPath[key])) {

        }
        else {
          this.mappingcode += `${className} ${variableName} = new ${className}();\n`
          this.mappingcode += `${variableName}.set${variableName}(${this.getInputVariablePath(outputClassPath[key]['leafValueInputPath'])});\n`;
          this.generateOutputClassPath(outputClassPath[key], variableName)
          this.mappingcode += `${listVariableName}.add(${variableName});\n`;
        }
      }
      else {
        let variableName = capitalizeFirstLetter(key);
        this.mappingcode += `${parentVariableName}.set${variableName}(${this.getInputVariablePath(outputClassPath[key]['leafValueInputPath'])});\n`;
      }
    }
  }

  getInputVariablePath(pathlist: string[]) {
    let res = ''
    for (const variable of pathlist) {
      if (variable === 'root') {
        res += 'root';
      }
      else if (variable === '$') {
        res += `.get(0)`
      }
      else {
        res += `.get${capitalizeFirstLetter(variable)}()`
      }
    }
    return res
  }


  protected readonly Array = Array;
}
