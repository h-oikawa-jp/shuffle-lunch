import firebase from '~/plugins/firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import dayjs from 'dayjs'
const firestore = firebase.firestore();

const usersCollection = firestore.collection('users');

export const state = () => ({
  list: [],
  one: null,
});

export const getters = {
  list: state => state.list,
  one: state => state.one,
};

export const mutations = {
  resetOne(state) {
    state.one = null;
  },
  ...firebaseMutations
};

export const actions = {
  INIT_USER: firebaseAction(({ bindFirebaseRef }, { id }) => {
    bindFirebaseRef('one', usersCollection.doc(id))
  }),
  INIT_USERS: firebaseAction(({ bindFirebaseRef }) => {
    bindFirebaseRef('list', usersCollection)
  }),
  UPDATE_MATCH_COUNT: firebaseAction((ctx, { self, uid, newMatchCount }) => {
    return usersCollection
      .doc(uid)
      .update({
        matchCount: newMatchCount,
        updatedBy: usersCollection.doc(self.uid),
        updatedAt: dayjs().toDate()
      });
  }),
};
