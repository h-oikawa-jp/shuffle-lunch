import firebase from '~/plugins/firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'
const firestore = firebase.firestore();

const entriesCollection = firestore.collection('entries');

export const state = () => ({
  entry: {},
});

export const getters = {
  entry: state => state.entry,
  groups: state => state.entry.groups || [],
};

export const mutations = {
  ...firebaseMutations
};

export const actions = {
  INIT_ENTRY: firebaseAction(({ bindFirebaseRef }, { id }) => {
    bindFirebaseRef('entry', entriesCollection.doc(id))
  }),
};
