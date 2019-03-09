import firebase from '~/plugins/firebase'
import auth from '~/plugins/auth'
import { firebaseMutations, firebaseAction } from 'vuexfire'
const firestore = firebase.firestore();

const usersCollection = firestore.collection('users');

const provider = new firebase.auth.GoogleAuthProvider();

export const state = () => ({
  user: null,
  users: [],
  isLoaded: false
});

export const getters = {
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
