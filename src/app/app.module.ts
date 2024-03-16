import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Json2classComponent } from './components/json2class/json2class.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { JsonMappingHelperComponent } from './components/json-mapping-helper/json-mapping-helper.component';
import { AppRoutingModule } from './app-routing.module';
import {MatChipOption, MatChipsModule} from '@angular/material/chips';
import {AngularTreeGridModule} from 'angular-tree-grid';
import { JsonescapeComponent } from './components/jsonescape/jsonescape.component';
import {MatTreeModule} from '@angular/material/tree';
import { JsondiffComponent } from './components/jsondiff/jsondiff.component';
import {MonacoEditorModule} from "ngx-monaco-editor";
// import {NgxTextDiffModule} from "ngx-text-diff";



@NgModule({
  imports: [BrowserModule, FormsModule, CommonModule, CodemirrorModule, MatCardModule,
    MatButtonModule, FlexLayoutModule, MatButtonToggleModule, MatToolbarModule, MatIconModule,
    MatTabsModule, MatMenuModule, MatCheckboxModule, BrowserAnimationsModule, AppRoutingModule,
    NgxJsonViewerModule, MatChipsModule, AngularTreeGridModule, MatTableModule, MatTreeModule,
    MonacoEditorModule.forRoot()
  ],
  declarations: [ AppComponent, Json2classComponent, MainPageComponent, JsonMappingHelperComponent, JsonescapeComponent, JsondiffComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
