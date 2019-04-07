import firebase from '~/plugins/firebase'
import auth from '~/plugins/auth'
import { firebaseMutations } from 'vuexfire'
const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

export const state = () => ({
  pageName: "",
  user: null,
  isAccountLoaded: false
});

export const getters = {
  pageName: state => state.pageName,
  user: state => state.user,
  isAccountLoaded: state => state.isAccountLoaded
};

export const mutations = {
  setPageName(state, next) {
    state.pageName = next
  },
  setCredential(state, user) {
    state.user = user
  },
  setIsAccountLoaded(state, next) {
    state.isAccountLoaded = !!next
  },
  ...firebaseMutations
};

export const actions = {
  async SET_CREDENTIAL({ commit }) {
    const user = await auth();
    if (user) {
      // firebase.auth で取得したアカウント情報を firestore 'users' collection へ反映。
      // => functions を使用してサーバ側でやるべき?
      firestore
        .collection('users')
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
    commit('setIsAccountLoaded', true);
  },
  async UNREGISTER({ commit }) {
    const user = await auth();
    if (user) {
      await firestore
        .collection('users')
        .doc(user.uid)
        .delete()
        .then();

      await user.delete();
      await firebase.auth().signOut();
    }

    commit('setCredential', null);
    location.reload();
  },
  signIn() {
    firebase.auth().signInWithRedirect(provider);
  },
  signOut() {
    firebase.auth().signOut()
      .then(() => location.reload());
  }
};
