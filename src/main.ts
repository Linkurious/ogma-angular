import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import {StoreModule} from "@ngrx/store";
import {counterReducer, edgeIdsReducer, nodeIdsReducer} from "./app/ogma/store/ogma.reducer";
import {importProvidersFrom} from "@angular/core";

bootstrapApplication(AppComponent, {providers: [
        importProvidersFrom(StoreModule.forRoot({
            counter: counterReducer,
            nodeIds: nodeIdsReducer,
            edgeIds: edgeIdsReducer
        }),)
    ]});
