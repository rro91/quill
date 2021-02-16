import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuillModule } from 'ngx-quill';
import { QuillComponent } from './quill/quill.component'

@NgModule({
  declarations: [
    AppComponent,
    QuillComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QuillModule.forRoot(),  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
