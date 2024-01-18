//import { LitElement, html, css } from 'lit';

import { firebase } from '@firebase/app';
import '@firebase/auth';

import { auth, db, storage } from './index.js';

export const C3doBaseElement = superClass => {
    class C3doBaseElement extends superClass {
        static get properties() {
            return {
                user: { type: Object },
                profile: { type: Object },

                auth: { type: Object },
                db: { type: Object },
                storage: { type: Object },
            };
        }

        constructor() {
            super();

            this.auth = auth;
            this.db = db;
            this.storage = storage;

            this.auth.onAuthStateChanged(user => {
                if (user) {
                    this.user = user;
                    //TODO: if we could return Promise in this call, then we could return redirect (need to test this theory)
                    //TODO: need to test that this reduce the repeat
                    if (!this.profile) {
                        this._getProfile(this.user);
                    }
                } else {
                    this._unProfile(this.user);
                    //user is signed out
                    this.user = null;
                }
            });
        }

        connectedCallback() {
            super.connectedCallback();
            console.info(this.localName + ' is connected');
        }

        disconnectedCallback() {
            super.disconnectedCallback();
            console.info(this.localName + ' is disconnected');

            /*
             */
        }

        // TODO: potentially can be improved using redirect using method in checking for unauthorized users
        // Specifically: Use lifecycle callback (onBeforeEnter(location, commands) and return commands redirect from navigatePage()
        _getProfile(user) {
            if (user) {
                let _this = this;
                let path = '/users/' + user.uid + '/Profile';
                this.db.ref(path).on('value', function(dataSnapshot) {
                    _this.profile = dataSnapshot.val();
                    if (_this.profile) {
                        console.info(_this.localName + ':getting profile');
                    } else {
                        console.error(_this.localName + ':no profile found');
                    }
                });
            }
        }

        _unProfile(user) {
            if (user) {
                let path = '/users/' + this.user.uid + '/Profile';
                this.db.ref(path).off('value');
                console.debug('removing the profile from ' + this.localName);
                this.profile = null;
            }
        }

        _isTeacher(role) {
            if (role === 'teacher') {
                return true;
            } else {
                return false;
            }
        }

        _isStudent(role) {
            if (role === 'student') {
                return true;
            } else {
                return false;
            }
        }

        _isAdmin(role) {
            if (role === 'admin') {
                return true;
            } else {
                return false;
            }
        }

        /*
         * _isDebug is checking whether the user's profile has debug flag stated as 'debug'.
         * The caller does not care about where is the information of debugLevelData comes from.
         */
        _isDebug() {
            if (this.profile.debug == 'debug') {
                return true;
            } else {
                return false;
            }
        }

        /*
         * _isNohardware is checking whether the user's profile has debug flag stated as 'no-hw' or 'demo',
         * where in both cases it will assume that the user does not have hardware, and hence should not access the bluetooth.
         * The caller does not care about where is the information of debugLevelData comes from.
         */
        _isNohardware() {
            //TODO in the future, there should be a separate attribute in the profile called 'hasHardware'
            //and when a user registered as 'demo', it should automatically set that 'hasHardware' is false.

            if (this.profile.debug == 'no-hw') {
                return true;
            } else if (this.profile.debug == 'demo') {
                return true;
            } else {
                return false;
            }
        }

        /**
         * _removeDBObserver(): detaching a callback that previously attached to a database query 'on'.
         * It has two arguments to make sure that the detached is happening at the correct one, as it could have
         * a side effect if the same query is being used at a different page, and may cause race condition with the result that
         * a different database query is accidentally cancelled.
         * @argument reference: the database reference when the query was turned on
         * @argument callback: the callback function that is being used to ensure a targeted cancellation.
         * @argument context: the context where the query was turned on, i.e the 'this' of the component
         */

        removeDBObserver(reference, callback, context) {
            reference.off('value', callback, context);
            console.info(
                'removing callback on ' + reference + ' from ' + this.localName,
            );
        }

        //TODO: this code is left here temporarily for use when writing the unit testing
        removeDBObserver2(path, callback) {
            let db = firebase.app('c3do').database();
            db.ref(path).off('value', callback);
            console.info('removing callback on ' + path + ' from ' + this.localName);
        }
    }

    return C3doBaseElement;
};
