import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import _ from 'lodash'
import {FirebaseDB} from "./firebase";
let isDev = false
firebase.initializeApp(require('../../src/firebaseConfig'))
export const db = firebase.firestore()
export const storage = firebase.storage()
export const storageConstants = firebase.storage

const simulateLogin = () => {

    return (process.env.NODE_ENV === "development") ?
        firebase.auth()
            .signInWithEmailAndPassword(process.env.REACT_APP_FIREBASE_USER, process.env.REACT_APP_FIREBASE_PASS)
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error(error)
            })
        : Promise.resolve()
}

export const signUp = (email, password, obj) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(config => {
            let user = config.user
            let doc = FirebaseDB.collection("users").doc(user.uid).set(obj)
                .then(thing => {
                    console.log(thing)
                    window.location = '/'
                })
                .catch(err => {
                    console.log(err)
                    return false
                })
            return doc
        }).catch(err => {
            console.log(err)
            return false
        })

}
export const logout = (e) => {
    e.preventDefault()
    firebase.auth().signOut()
        .then(res => {
            console.log(res)
            window.location.href = '/'
        })
        .catch(err => {
            console.log(err)
        })
}
export const login = (email, password) => {
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(res => {
                console.log(res)
                resolve(res)
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    }
    )
}



export const checkUser = () => {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                resolve(user)
            }
            else {
                resolve(null)
            }
        })
    })
}

export const getCurrentUser = () => {
    return firebase.auth.currentUser;

}
export const upload = (file, updateProgress, updateSize, metaData) => {

    return new Promise((resolve, reject) => {

        getUser()
            .then(user => {

                if (isDev) {

                    if (!_.isUndefined(updateSize)) { updateSize(1000) }

                    setTimeout(function () {
                        if (!_.isUndefined(updateProgress)) { updateProgress(20) }
                    }, 1000)

                    setTimeout(function () {
                        if (!_.isUndefined(updateProgress)) { updateProgress(60) }
                    }, 2000)

                    setTimeout(function () {
                        if (!_.isUndefined(updateProgress)) { updateProgress(100) }
                        resolve(
                            {
                                storageType: 'gcp',
                                bucket: 'foo',
                                path: `users/someuploadedfilehere.pdf`
                            }
                        )
                    }, 3000)

                } else {

                    const storageRef = storage.ref("users")

                    const uploadTask = storageRef.child(`/${user.uid}/${file.name}`)
                        .put(file, metaData || { 'contentType': file.type })

                    uploadTask.on(storageConstants.TaskEvent.STATE_CHANGED,
                        (snapshot) => {

                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

                            if (!_.isUndefined(updateProgress)) { updateProgress(progress) }
                            if (!_.isUndefined(updateSize)) { updateSize(snapshot.totalBytes) }
                        },
                        (error) => reject(error),
                        () =>

                            resolve(
                                {
                                    storageType: 'gcp',
                                    bucket: uploadTask.snapshot.metadata.bucket,
                                    path: `${uploadTask.snapshot.metadata.fullPath}`
                                }
                            )
                    )
                }
            })
            .catch(error => resolve(error))
    })
}

export const signout = () => {
    /*
     NOTE: We can't can only try a signout and redirect user back to login. If the
     signout attempt here fails, then we're trying again in login
    */
    if (!isDev) {

        firebase.auth().signOut()
            .catch(error => {
                /* Can't do much here ... or can we? */
            });
    }

    (isDev) ?
        // eslint-disable-next-line no-console
        console.log('User has attemped a log out ... sending back to login')
        : window.location.replace('/?signout=yes');
}


export const setMessageSeen = (messageType) => {

    if (isDev) {

        return Promise.resolve()

    } else {

        return getUser()
            .then(user => {

                return db.collection("users").doc(user.uid).get()
                    .then(doc => {

                        if (doc.exists) {

                            return db.collection("users").doc(user.uid).collection("messaging")
                                .doc(messageType).set({ showMessage: false })

                        } else {

                            throw Error('Trying to set message as showMessage on invalid user')
                        }
                    })
            })
    }
}

export const getMessageType = (user) => _.has(user, 'roles.rating') ? 'rating' : 'portal'

const getShowMessage = (uid, type) => {

    if (isDev) {

        return false

    } else {

        return db.collection("users").doc(uid).collection("messaging").doc(type).get()
            .then(doc => {

                if (doc.exists) {

                    return doc.data().showMessage

                } else {

                    return false
                }
            })
    }
}

export const getUser = () => {

    if (isDev) {

        console.log('Returning dev user')

        return Promise.resolve(
            {
                uid: '12345',
                email: 'mmantle@gmail.com',
                firstName: 'Mickey',
                lastName: 'Mantle',
                roles: ['employee', 'fax'],
                pendingRoles: [],
                showPatchMessage: true
            }
        )

    } else {

        return db.collection("users").doc(firebase.auth().currentUser.uid)
            .get()
            .then(userDoc => {

                const user = userDoc.data()

                /*
                 NOTE: User should not get here with nothing in either pendingRoles or roles,
                       so for now this will make that assumption
                */

                const pendingRoles = user.pendingRoles || {}
                const roles = user.roles || {}

                /*
                 Registration requies first, last for all and "technically" this should
                 be the same in all - or ideally on in one role (those should be known)
                 and all other roles are additive. Or maybe shifting demographic info to
                 root?
                */

                const firstAndLastFromRoles = _.head(_.filter(roles, role => _.has(role, 'firstName'))) || {}
                const firstAndLastFromPending = _.head(_.filter(pendingRoles, role => _.has(role, 'firstName'))) || {}
                const userInfo = firstAndLastFromRoles || firstAndLastFromPending

                /* Add specific broker data */

                const brokerData = _.has(roles, 'broker') ? {
                    adminFee: _.has(roles.broker, 'adminFee') ? roles.broker.adminFee : 15.99
                } : {}

                const throwInvalidUser = () => { throw Error('Invalid User') }

                const { firstName, lastName } = _.isUndefined(userInfo) ? throwInvalidUser() :
                    { firstName: userInfo.firstName, lastName: userInfo.lastName }

                return {
                    ...{
                        uid: firebase.auth().currentUser.uid,
                        email: user.email,
                        firstName: firstName,
                        lastName: lastName,
                        roles: _.keys(roles),
                        pendingRoles: _.keys(pendingRoles)
                    }, ...brokerData
                }
            })
            .then(user => {

                return getShowMessage(user.uid, getMessageType(user))
                    .then(result => {

                        return {...user, showPatchMessage: result}
                    })
            })
            .catch(error => {

                console.error(error)
            })
    }
}

export const getToken = () => {
    return firebase.auth().currentUser.getIdTokenResult(true)
        .then(idTokenResult => {
            return idTokenResult.token
        })
}

export const initializeUser = (onLoggedIn) => {

    if (isDev) {

        getUser().then(dbUser => {

            onLoggedIn(dbUser)

            return () => { console.log('Unsubscribed ...') }
        })

    } else {

        return simulateLogin().then(() => {

            return firebase.auth().onAuthStateChanged(user => {

                if (user) {

                    if (onLoggedIn) getUser().then(dbUser => onLoggedIn(dbUser))

                } else {

                    (process.env.NODE_ENV === "development") ?
                        // eslint-disable-next-line no-console
                        console.log('User has been logged out or disabled ... sending back to login')
                        : window.location.replace('/toLogin');
                }
            })
        })
    }
}

export const restConfig = () => {

    const baseHeaders = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const addHeader = (toAdd) => { return { ...baseHeaders, headers: { ...baseHeaders.headers, ...toAdd } } }

    return (isDev ? Promise.resolve("12345") : getToken())
        .then(token => getUser().then(dbUser => { return { token, user: dbUser.email }}))
        .then(tokenAndUser => addHeader({ Authorization: `Bearer ${tokenAndUser.token}`, user: tokenAndUser.user }))
}
