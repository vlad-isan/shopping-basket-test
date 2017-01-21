/**
 * Created by vlad on 21/01/17.
 */

import { Component }            from '@angular/core';
import {ShoppingService}        from "../services/shopping.service";

@Component({
    moduleId:       module.id,
    selector:       'my-app',
    templateUrl:    'app.template.html',
    providers:      [ ShoppingService ]
})
export class AppComponent {

}