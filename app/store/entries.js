import firebase from '~/plugins/firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'
const firestore = firebase.firestore();

const entriesCollection = firestore.collection('entries');

export const state = () => ({
  list: null,
  entryId: null,
});

export const getters = {
  entryId: state => state.entryId,
  entry: state => {
    if (!state.list || !state.entryId) return {};
    return state.list.find(x => x.id === state.entryId) || {};
  },
};

export const mutations = {
  setEntryId(state, next) {
    state.entryId = next
  },
  ...firebaseMutations
};

export const actions = {
  INIT_ENTRIES: firebaseAction(({ bindFirebaseRef }, { postId }) => {
    bindFirebaseRef('list', entriesCollection
      .where('state', 'array-contains', 'PROCESSED')
      .where('postId', '==', postId));
  }),
};
