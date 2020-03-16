import React, { useState, useEffect } from 'react'
import { checkUser, logout, getCurrentUser, signUp, restConfig, signout, upload, db, setMessageSeen, getMessageType, login, storage, storageConstants, getUser } from './backend'
import _ from 'lodash'


export const FirebaseDB = db

export const FirebaseContext = React.createContext({})

export const Storage = storage

export const FirebaseProvider = ({children }) => {

    const [userData, setUserData] = useState({
        user: undefined,
        isLoading: true
    })
    useEffect(() => {
        checkUser()
            .then(user => {
                if (user !== null) {
                    FirebaseDB.collection("users").doc(user.uid).get()
                        .then(doc => {
                            let userdata = {...doc.data()}
                            userdata.uid = user.uid
                            setUserData({
                                user: userdata,
                                isLoading: false
                            })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                else {
                    console.log("User logged out")
                    setUserData({user: undefined, isLoading: false})
                }
            })
            .catch(err => {
                console.log(err)
            })

    },[])


    return (
        <FirebaseContext.Provider value={{logout, getCurrentUser, upload, signout, storage, signUp, loginUser:login, isUserLoading: userData.isLoading, user: userData.user, restConfig: userData.restConfig }}>
            {children}
        </FirebaseContext.Provider>
    );
}
