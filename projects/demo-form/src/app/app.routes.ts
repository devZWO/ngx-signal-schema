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
        path: 'search-at-least-one-criteria-example',
        loadComponent: () => import('./examples/require-on-of-example/search-at-least-one-criteria-example').then(m => m.SearchAtLeastOneCriteriaExampleComponent)
    },
    {
        path: 'required-limitations-example',
        loadComponent: () => import('./examples/required-limitations-example/required-limitations-field').then(m => m.RequiredExtendedExample)
    },
    {
        path: 'required-limitations-example-simplified',
        loadComponent: () => import('./examples/required-limitations-example/required-limitations-field-simplified').then(m => m.SimplifiedRequiredExtendedExample)
    },
    {
        path: '',
        redirectTo: 'flat-model-example',
        pathMatch: 'full'
    }
];
