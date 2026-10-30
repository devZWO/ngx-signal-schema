import {Component, signal} from '@angular/core';
import {applyWhen, form, required, FormField} from '@angular/forms/signals';
import {applyIf, notOnlyBlank, requiredDefined, requiredTrimmed, TrimDirective} from '@devzwo/ngx-signal-schema';

interface NamePublishingOptions {
  name: string;
  publish: boolean | null;
}

@Component({
  selector: 'app-simplified-required-limitations-example',
  imports: [FormField, TrimDirective],
  template: `
      <section style="display: flex; flex-direction: column; gap: 24px;">
          <h1>Limitations of default required validator</h1>

          <p>
              The standard <code>required</code> validator has limitations: it accepts whitespace-only strings as valid and treats <code>false</code> as invalid.
              This example demonstrates how <code>requiredTrimmed</code> ensures strings contain non-whitespace characters (mandatory), <code>notOnlyBlank</code> rejects whitespace-only strings while keeping empty inputs valid (optional), <code>requiredDefined</code> allows <code>false</code> while still requiring a value to be present, and the <code>trim</code> directive automatically sanitizes whitespace on blur.
          </p>

          <div>
              <h2>NAME - requiredTrimmed / notOnlyBlank</h2>
              <div class="validator-switch" style="flex-direction: column; gap: 8px;">
                  <div style="display: flex; gap: 16px;">
                      <label>
                          <input type="radio" name="name-validator" [checked]="nameValidatorType() === 'required'" (change)="nameValidatorType.set('required')"/>
                          Default (required)
                      </label>
                      <label>
                          <input type="radio" name="name-validator" [checked]="nameValidatorType() === 'requiredTrimmed'" (change)="nameValidatorType.set('requiredTrimmed')"/>
                          requiredTrimmed
                      </label>
                      <label>
                          <input type="radio" name="name-validator" [checked]="nameValidatorType() === 'notOnlyBlank'" (change)="nameValidatorType.set('notOnlyBlank')"/>
                          notOnlyBlank
                      </label>
                  </div>
                  <div style="display: flex; gap: 16px; border-top: 1px solid #ccc; padding-top: 8px;">
                      <label>
                          <input #trimCb type="checkbox" [checked]="trimEnabled()" (change)="trimEnabled.set(trimCb.checked)"/>
                          Enable trim on blur
                      </label>
                      @if (trimEnabled()) {
                          <label>
                              <input #ctrlCharCb type="checkbox" [checked]="trimControlCharacters()" (change)="trimControlCharacters.set(ctrlCharCb.checked)"/>
                              Trim control characters
                          </label>
                      }
                  </div>
              </div>

              <div class="field">
                  <div class="row">
                      <label for="name">Name</label>
                      <input
                          id="name"
                          [formField]="exampleForm.name"
                          placeholder="<My Name>"
                          [trim]="trimEnabled()"
                          [trimControlCharacters]="trimControlCharacters()"
                      />
                  </div>
                  @if (exampleForm.name().errors(); as errors) {
                      <span class="error">{{ errors[0]?.message }}</span>
                  }
              </div>
          </div>

          <div>
              <h2>Publish - requiredDefined</h2>
              <div class="validator-switch">
                  <label>
                      <input type="radio" name="publish-validator" [checked]="publishValidatorType() === 'required'" (change)="publishValidatorType.set('required')"/>
                      Default (required)
                  </label>
                  <label>
                      <input type="radio" name="publish-validator" [checked]="publishValidatorType() === 'requiredDefined'" (change)="publishValidatorType.set('requiredDefined')"/>
                      requiredDefined
                  </label>
              </div>

              <div class="field">
                  <fieldset>
                      <legend>Publishing Option</legend>
                      <label>
                          <input type="radio" name="publish" [checked]="exampleForm.publish().value() === true" (change)="exampleForm.publish().value.set(true)"/>
                          Public (true)
                      </label>
                      <label>
                          <input type="radio" name="publish" [checked]="exampleForm.publish().value() === false" (change)="exampleForm.publish().value.set(false)"/>
                          Private (false)
                      </label>
                      <label>
                          <input type="radio" name="publish" [checked]="exampleForm.publish().value() === null" (change)="exampleForm.publish().value.set(null)"/>
                          don't know (null)
                      </label>
                  </fieldset>
                  @if (exampleForm.publish().errors(); as errors) {
                      <span class="error">{{ errors[0]?.message }}</span>
                  }
              </div>
          </div>

          <button [disabled]="exampleForm().invalid()">Submit</button>
      </section>
  `,
  styles: `
    .field { margin-top: 8px; margin-bottom: 16px; }
    .row { display: flex; gap: 8px; }
    .error { color: red; font-size: 12px; display: block; }
    fieldset { display: flex; gap: 12px; }
    .validator-switch { display: flex; gap: 16px; margin-bottom: 8px; padding: 8px; background: #f0f0f0; border-radius: 4px; }
  `
})
export class SimplifiedRequiredExtendedExample {

  protected readonly nameValidatorType = signal<'required' | 'requiredTrimmed' | 'notOnlyBlank'>('required');
  protected readonly publishValidatorType = signal<'required' | 'requiredDefined'>('required');
  protected readonly trimEnabled = signal(false);
  protected readonly trimControlCharacters = signal(false);

  protected readonly model = signal<NamePublishingOptions>({
    name: '',
    publish: null,
  });

  protected readonly exampleForm = form(this.model, (fieldPath) => {
    applyWhen(
        fieldPath.name,
        () => this.nameValidatorType() === 'required',
        (path) => required(path, {message: 'Name is required'}),
    );
    applyWhen(
        fieldPath.name,
        () => this.nameValidatorType() === 'requiredTrimmed',
        (path) => requiredTrimmed(path, {error: {message: 'Name is required'}}),
    );
    applyWhen(
        fieldPath.name,
        () => this.nameValidatorType() === 'notOnlyBlank',
        (path) => notOnlyBlank(path, {error: {message: 'Name cannot consist only of whitespace'}}),
    );

    applyIf(
        fieldPath.publish,
        () => this.publishValidatorType() === 'required',
        (path) => required(path, {message: 'Publishing option is required'}),
        (path) => requiredDefined(path, {error: {message: 'Publishing option is required'}})
    );
  });
}
