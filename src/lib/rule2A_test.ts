import {html, render} from 'lit-html';
import {getDefaultContext} from './context';
import {rule2A} from './rule2A';

describe('The function for rule 2A', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("returns empty string for hidden elems that aren't referenced", () => {
    render(html`<div id="foo" hidden>Hello world</div>`, container);
    const elem = document.getElementById('foo');
    expect(rule2A(elem!)).toBe('');
  });

  it('returns null for hidden elems that are referenced in an aria-labelledby', () => {
    render(html`<div id="foo" hidden>Hello world</div>`, container);
    const elem = document.getElementById('foo');
    const context = getDefaultContext();
    context.directLabelReference = true;
    expect(rule2A(elem!, context)).toBe(null);
  });

  it('returns null for hidden elems that are referenced by a label element', () => {
    render(html`<div id="foo" hidden>Hello world</div>`, container);
    const elem = document.getElementById('foo');
    const context = getDefaultContext();
    context.directLabelReference = true;
    expect(rule2A(elem!, context)).toBe(null);
  });

  it('returns null for elem that is not hidden', () => {
    render(html`<div id="foo">Hello world</div>`, container);
    const elem = document.getElementById('foo');
    expect(rule2A(elem!)).toBe(null);
  });

  it('considers aria-hidden', () => {
    render(html`<div id="foo" aria-hidden="true">Hello world</div>`, container);
    const elem = document.getElementById('foo');
    expect(rule2A(elem!)).toBe('');
  });

  it('considers CSS display none', () => {
    render(
      html`
        <div id="foo">Hello world</div>
        <style>
          #foo {
            display: none;
          }
        </style>
      `,
      container
    );
    const elem = document.getElementById('foo');
    expect(rule2A(elem!)).toBe('');
  });

  it('considers CSS visibility hidden', () => {
    render(
      html`
        <div id="foo">Hello world</div>
        <style>
          #foo {
            visibility: hidden;
          }
        </style>
      `,
      container
    );
    const elem = document.getElementById('foo');
    expect(rule2A(elem!)).toBe('');
  });

  it('considers hidden ancestors', () => {
    render(
      html`
        <div hidden>
          <div>
            <div>
              <div id="foo">Hello world</div>
            </div>
          </div>
        </div>
      `,
      container
    );
    const elem = document.getElementById('foo');
    expect(rule2A(elem!)).toBe('');
  });

  it('considers display:none ancestors', () => {
    render(
      html`
        <div id="bar">
          <div>
            <div>
              <div id="foo">Hello world</div>
            </div>
          </div>
        </div>
        <style>
          #bar {
            display: none;
          }
        </style>
      `,
      container
    );
    const elem = document.getElementById('foo');
    expect(rule2A(elem!)).toBe('');
  });

  it('considers visibility:hidden ancestors', () => {
    render(
      html`
        <div id="bar">
          <div>
            <div>
              <div id="foo">Hello world</div>
            </div>
          </div>
        </div>
        <style>
          #bar {
            visibility: hidden;
          }
        </style>
      `,
      container
    );
    const elem = document.getElementById('foo');
    expect(rule2A(elem!)).toBe('');
  });
});
