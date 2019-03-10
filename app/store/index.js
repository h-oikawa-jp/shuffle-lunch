import firebase from '~/plugins/firebase'
import auth from '~/plugins/auth'
import dayjs from 'dayjs'
import { firebaseMutations, firebaseAction } from 'vuexfire'
const firestore = firebase.firestore();

const usersCollection = firestore.collection('users');
const postsCollection = firestore
  .collection('posts')
  .orderBy('createdAt', 'desc');

const provider = new firebase.auth.GoogleAuthProvider();

export const state = () => ({
  user: null,
  users: [],
  posts: [],
  isLoaded: false
});

export const getters = {
  posts: state => {
    return state.posts.map(post => {
      post.user = state.users.find(user => user.uid === post.createdBy.uid);
      return post
    })
  },
  users: state => state.users,
  user: state => state.user,
  isLoaded: state => state.isLoaded
};

export const mutations = {
  setCredential(state, user) {
    state.user = user
  },
  setIsLoaded(state, next) {
    state.isLoaded = !!next
  },
  ...firebaseMutations
};

export const actions = {
  async SET_CREDENTIAL({ commit }) {
    const user = await auth();
    if (user) {
      usersCollection
        .doc(user.uid)
        .set({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          icon: user.photoURL
        });

      commit('setCredential', {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      });

    } else {
      commit('setCredential', null);
    }
  },
  INIT_USERS: firebaseAction(({ bindFirebaseRef }) => {
    bindFirebaseRef('users', usersCollection)
  }),
  INIT_POSTS: firebaseAction(({ bindFirebaseRef }) => {
    bindFirebaseRef('posts', postsCollection)
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
  signIn() {
    firebase.auth().signInWithRedirect(provider);
  },
  signOut() {
    firebase.auth().signOut()
      .then(() => location.reload());
  },
  loadComplete({ commit }) {
    commit('setIsLoaded', true)
  }
};
