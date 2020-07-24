import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MultiselectComponent } from './multiselect-dropdown/multiselect-dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    MultiselectComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
