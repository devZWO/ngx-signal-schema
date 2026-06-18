import {Routes} from '@angular/router';

export const routes: Routes = [
    {
        path: 'flat-model-example',
        loadComponent: () => import('./examples/flat-model-example').then(m => m.FlatModelExample)
    },
    {
        path: 'hierarchic-model-example',
        loadComponent: () => import('./examples/hierarchic-model-example').then(m => m.HierarchicModelExample)
    },
    {
        path: 'array-example',
        loadComponent: () => import('./examples/array-example').then(m => m.ArrayExample)
    },
    {
        path: '',
        redirectTo: 'flat-model-example',
        pathMatch: 'full'
    }
];
