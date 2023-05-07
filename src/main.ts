import './style.css';
import {UI} from '@peasy-lib/peasy-ui';
import {Assets} from '@peasy-lib/peasy-assets';
import {Input} from '@peasy-lib/peasy-input';
const model={};
const template=`<div> Hello Peasy!!! </div>`;
UI.create(document.body, template, model);
console.log(`Hello World`);
