import firebase from '~/plugins/firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import dayjs from 'dayjs'
const firestore = firebase.firestore();

const usersCollection = firestore.collection('users');
const postsCollection = firestore.collection('posts');

export const state = () => ({
  list: [],
  one: null,
});

export const getters = {
  list: state => state.list,
  one: state => state.one,
};

export const mutations = {
  ...firebaseMutations
};

export const actions = {
  INIT_POST: firebaseAction(({ bindFirebaseRef }, { id }) => {
    bindFirebaseRef('one', postsCollection.doc(id))
  }),
  INIT_POSTS: firebaseAction(({ bindFirebaseRef }) => {
    bindFirebaseRef('list', postsCollection
      .where('state', 'array-contains', 'ACTIVE')
      .orderBy('createdAt', 'desc'))
  }),
  ADD_POST: firebaseAction((ctx, { user, title, body }) => {
    postsCollection
      .doc()
      .set({
        title,
        body,
        state: ['ACTIVE'],
        createdBy: usersCollection.doc(user.uid),
        createdAt: dayjs().toDate()
      })
  }),
  DELETE_POST: firebaseAction((ctx, { user, post }) => {
    postsCollection
      .doc(post.id)
      .update({
        state: ['DELETED'],
        deletedBy: usersCollection.doc(user.uid),
        deletedAt: dayjs().toDate()
      })
  }),
  SET_POST_STATE: firebaseAction((ctx, { user, post, state }) => {
    postsCollection
      .doc(post.id)
      .update({
        state,
        updatedBy: usersCollection.doc(user.uid),
        updatedAt: dayjs().toDate()
      })
  }),
};
