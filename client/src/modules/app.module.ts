import './rxjs-extensions';

import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { HttpModule, JsonpModule }           from '@angular/http';

import { AppComponent }         from '../components/app.component';
import { BasketComponent }      from '../components/basket.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule
    ],
    declarations: [
        AppComponent,
        BasketComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }