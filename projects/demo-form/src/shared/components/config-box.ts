import { Component } from '@angular/core';

/**
 * A component that displays a box styled for live configuration of signal form schemas.
 */
@Component({
    selector: 'app-config-box',
    imports: [],
    template: `
        <div class="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
            <h2 class="text-lg font-semibold text-cyan-800">Validation Configuration</h2>
            <ng-content/>
        </div>
    `,
    styles: ``,
})
export class ConfigBox {}
