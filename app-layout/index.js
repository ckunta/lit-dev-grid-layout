import ("../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js");
import ("../node_modules/lit/polyfill-support.js");


console.log('Inside index.js');


import ('./app-classroom.js');

const note = document.createElement('c3do-classroom-apps');

document.getElementById('outlet').appendChild(note);
