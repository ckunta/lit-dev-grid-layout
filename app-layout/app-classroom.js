import { LitElement, html, css } from 'lit';




import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-pages/iron-pages.js';

/*

import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/communication-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icons/hardware-icons.js';
import '@polymer/paper-button/paper-button.js';
*/

export { C3doClassroomApps };

class C3doClassroomApps extends LitElement {
    static get properties() {
        return {
            title: { type: String },

            user: { type: Object },

            //signedIn: { type: Boolean },
            online: { type: Boolean },
            location: { type: Object },

            narrow: { type: Boolean },
        };
    }

    static get styles() {
        return css`

      :host {
        min-height: 100vh;
        display: grid;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        margin: 0 auto;

        background-color: var(--todo-apps-background-color);
        background-color: #f3f4f8;

        --app-primary-color: #4285f4;
        --app-secondary-color: black;
      }


      .container {
         display: grid;
         grid-template-columns: 0.5fr 1.5fr;
         grid-template-rows: 0.5fr 1.5fr;
         gap: 0px 0px;
         grid-auto-flow: row;
         grid-template-areas:
            "Tollbar Toolbar"
            "Menu MainDisplay";
      }

      .Menu { grid-area: Menu; } 

      .Toolbar { 
         display: grid;
         grid-template-columns: 0.5fr 0.8fr 1.7fr 1fr 1fr;
         grid-template-rows: 1.1fr;
         gap: 0px 0px;
         grid-auto-flow: row;
         grid-template-areas: ".....";
         grid-area: Toolbar; 
      }

      .MainDisplay { grid-area: MainDisplay; }

      html, body, .container {
          height: 100%;
          margin: 0;
      }

.container * {
  border: 1px solid grey;
  position: relative;
}


    `;
    }


    connectedCallback() {
        super.connectedCallback();
    }


    constructor() {
        super();
        console.log("Constructor");
        //this.title = 'C3DO Classroom';
        //this.signedIn = false;

        //put in declaration when switched to typescript
        this.online = true;

        //add event listener here
        this.addEventListener('narrow-changed', this._narrowChanged);
        this.addEventListener('close-drawer', this._closeDrawer);

        //simulate the narrow or not of the drawer
        this.narrow = true;
    }


    render(){
        return html`
           <div class="container">
             <div class="Menu">
                <!-- replacement for c3do-menu -->
               <div><a name="home" href="${this.rootPath}">Home</a></div>
               <div>
                  <a name="users" href="${this.rootPath}users">Users</a>
               </div>
             </div>
             <div class="Toolbar">
                ${this.getToolbar()}
             </div>
             <div class="MainDisplay">
                ${this.getMainSection()}
             </div>
           </div>
        `;
    }


    /*

    render() {
        return html`
      <!-- app-location binds to the app's URL -->

      <app-drawer-layout
        id="layout"
        @narrow-changed="${this._narrowChanged}"
      >
        <!-- Drawer content -->
        <app-drawer swipeOpen="${this.narrow}" id="drawer" slot="drawer">
          <app-toolbar>Menu</app-toolbar>

          <!-- replacement for c3do-menu -->
          <div><a name="home" href="${this.rootPath}">Home</a></div>
          <div>
            <a name="users" href="${this.rootPath}users">Users</a>
          </div>

        </app-drawer>

        <!-- main section -->
        <app-header-layout has-scrolling-region>
          <app-header condenses fixed effects="waterfall" slot="header">
            <!-- TODO title should not be hardcoded, but need to fix issue in initializing it in constructor or in constant -->

            <!-- replacement of c3do-toolbar -->
            ${this.getToolbar()}
          </app-header>

          <div>${this.getMainSection()}</div>
        </app-header-layout>
      </app-drawer-layout>
    `;
    }
    */


    /*
     * getMainsection: define the main page, whether it's sign-in screen,
     * register screen (no profile), or
     * send to lastpage
     */


    getMainSection() {
        if (this.user) {
            return html` <slot></slot> `;
        } else {
            return html`
              (The Main Section is here) <br>
              Please sign in here

<!--
        <c3do-login .user="${this.user}" @sign-in="${this._signIn}">
        </c3do-login>
-->
      `;
        }
    }


    getToolbar(){
        return html`
          
          <div>C3DO Classroom</div>

          <div>Lesson Plan</div>


          <div>Classroom </div>

          <div>
            Online Icon -- Lock Icon
          </div>

          <div>
            User Name is here
          </div>

    `;
    }

    _signIn(e) {
        //this.signedIn = true;
        //this.user = e.detail;
        if (location.pathname !== '/') {
            Router.go(location.pathname);
        } else {
            Router.go('/last-page');
        }
    }

    _signOut() {
        this.signedIn = false;
        this.user = undefined;
    }

    /*
     * _narrowChanged: an observer function to identify the state of the responsive layout.
     * It is mainly for debugging.
     */
    _narrowChanged(e) {
        this.narrow = e.detail.value;
        console.debug('narrow value is ' + e.detail.value);
    }

    /*
     * _toggleDrawer: a function to toggle the drawer (i.e the menu).
     * This function will hide or unhide the menu using the responsive layout, as if it is narrow
     */
    _toggleDrawer(e) {
        this.renderRoot.querySelector('#layout').forceNarrow =
            !this.renderRoot.querySelector('#layout').forceNarrow;
    }

    /*
     * _closeDrawer: a function to enforce that the drawer (i.e. the menu) to be hidden.
     */
    _closeDrawer(e) {
        this.renderRoot.querySelector('#layout').forceNarrow = true;
    }

    /*
     * _openDrawer: a function to enforce that the drawer (i.e. the menu) to be hidden.
     */
    _openDrawer(e) {
        this.renderRoot.querySelector('#layout').forceNarrow = false;
    }
}

customElements.define('c3do-classroom-apps', C3doClassroomApps);
