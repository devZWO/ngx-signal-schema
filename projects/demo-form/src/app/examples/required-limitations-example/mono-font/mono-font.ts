import { Component } from '@angular/core';

/* eslint-disable @angular-eslint/component-selector */
@Component({
    selector: 'mono',
    imports: [],
    template: `<span class="font-mono"><ng-content/></span> `,
    styles: `
        :host {
            display: contents;
        }
    `,
})
export class MonoFont {}
