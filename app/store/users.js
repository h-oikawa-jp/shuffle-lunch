import firebase from '~/plugins/firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'
const firestore = firebase.firestore();

const usersCollection = firestore.collection('users');

export const state = () => ({
  list: []
});

export const getters = {
  list: state => state.list
};

export const mutations = {
  ...firebaseMutations
};

export const actions = {
  INIT_USERS: firebaseAction(({ bindFirebaseRef }) => {
    bindFirebaseRef('list', usersCollection)
  })
};
