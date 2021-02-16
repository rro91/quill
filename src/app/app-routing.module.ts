import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {QuillComponent} from "./quill/quill.component";
import {CkeComponent} from "./cke/cke.component";

const routes: Routes = [
  {
    path: 'quill',
    component: QuillComponent
  },
  {
    path: 'cke',
    component: CkeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
