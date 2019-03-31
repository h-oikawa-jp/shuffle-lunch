<template lang="html">
  <div class="userinfo">
    <div class="mcard media media-user" v-if="user">
      <div class="media-content">
        <div class="content">
          <figure class="has-text-centered">
            <div class="image is-64x64" style="margin: 0 auto;">
              <img :src="user.photoURL" />
            </div>
          </figure>
          <p class="has-text-centered ml-4">
            <strong>{{ user.displayName }}</strong>
            <a class="icon ml-1" @click="unregister"><i class="fa fa-trash"></i></a>
          </p>
        </div>
      </div>
      <a class="button is-primary" @click="signOut">Sign out</a>
    </div>
    <div class="mcard media media-user" v-else>
      <a class="button is-primary" @click="signIn">Sign in with Google</a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    unregister: function (event) {
      const res = confirm('ログイン中のアカウント[' + this.user.email + ']を削除します。本当によろしいですか？');
      if( res === true ) {
        this.$store.dispatch('UNREGISTER');
      }
    },
    ...mapActions(['signIn', 'signOut'])
  }
}
</script>

<style scoped>
.userinfo .mcard {
  background: #fff;
  border: solid 1px #e6e6e6;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 32px auto;
  padding: 16px 0;
}
.userinfo .media-user {
  width: 280px;
  height: 220px;
}
.userinfo {
  justify-content: center;
  align-items: flex-start;
  display: flex;
}
</style>
