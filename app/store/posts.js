import firebase from '~/plugins/firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import dayjs from 'dayjs'
const firestore = firebase.firestore();

const usersCollection = firestore.collection('users');
const postsCollection = firestore.collection('posts').orderBy('createdAt', 'desc');

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
  INIT_POSTS: firebaseAction(({ bindFirebaseRef }) => {
    bindFirebaseRef('list', postsCollection)
  }),
  ADD_POST: firebaseAction((ctx, { user, body }) => {
    firestore
      .collection('posts')
      .doc()
      .set({
        body,
        createdBy: usersCollection.doc(user.uid),
        createdAt: dayjs().toDate()
      })
  }),
};
