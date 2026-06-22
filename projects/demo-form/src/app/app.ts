import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive
    ],
    template: `
        <main class="flex flex-col gap-6 w-full p-8 max-w-200 mx-auto shadow-lg rounded-xl my-8 border-t-4 border-orange-500">
            <nav class="flex gap-4 border-b pb-4">

                <a routerLink="/flat-model-example" routerLinkActive="text-orange-500 font-bold" class="text-cyan-700 hover:text-cyan-900 transition-colors">Flat Model Example</a>

                <a routerLink="/hierarchic-model-example" routerLinkActive="text-orange-500 font-bold" class="text-cyan-700 hover:text-cyan-900 transition-colors">Hierarchic Model Example</a>

                <a routerLink="/array-example" routerLinkActive="text-orange-500 font-bold" class="text-cyan-700 hover:text-cyan-900 transition-colors">Array Example</a>
            </nav>

            <router-outlet/>
        </main>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
}
