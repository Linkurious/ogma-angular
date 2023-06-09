import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import {StoreModule} from "@ngrx/store";
import { edgeIdsReducer, nodeIdsReducer, viewReducer} from "./app/ogma/store/ogma.reducer";
import {importProvidersFrom} from "@angular/core";

bootstrapApplication(AppComponent, {providers: [
        importProvidersFrom(StoreModule.forRoot({
            nodeIds: nodeIdsReducer,
            edgeIds: edgeIdsReducer,
            view: viewReducer
        }),)
    ]});
