import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Json2classComponent } from './components/json2class/json2class.component';
import { JsonMappingHelperComponent } from './components/json-mapping-helper/json-mapping-helper.component';
import { JsonescapeComponent } from './components/jsonescape/jsonescape.component';
import {JsondiffComponent} from "./components/jsondiff/jsondiff.component";

const routes: Routes = [
  {path: '', redirectTo: 'json-mapping-helper', pathMatch: 'full'},
  {path: 'json2class', component: Json2classComponent},
  {path: 'json-mapping-helper', component: JsonMappingHelperComponent},
  {path: 'jsonescape', component: JsonescapeComponent},
  {path: 'jsondiff', component: JsondiffComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
