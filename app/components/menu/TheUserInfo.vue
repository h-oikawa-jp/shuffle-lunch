<template lang="html">
  <v-card
    v-if="user"
    class="userinfo mt-2 ml-2 mr-2"
  >
    <v-layout
      align-center
      justify-center
      column
      class="pt-2 pb-2"
    >
        <v-card-media
          :src="user.photoURL"
          width="64px"
          class="elevation-6 mt-3 mb-3"
        >
        </v-card-media>

        <v-card-title class="subheading font-weight-bold">
          <strong class="icon ml-3">{{ user.displayName }}</strong>
          <a class="icon ml-2" @click="unregister"><i class="fa fa-trash"></i></a>
        </v-card-title>

        <v-list-tile-content>
          <v-list-tile-sub-title>{{ user.email }}</v-list-tile-sub-title>
        </v-list-tile-content>

        <v-card-actions
          class="mt-2 mb-2"
        >
          <v-btn color="teal lighten-2" @click="signOut">Sign out</v-btn>
        </v-card-actions>
    </v-layout>

  </v-card>
  <v-card
    v-else
    class="mt-2 ml-2 mr-2"
  >
    <v-layout
      align-center
      justify-center
      column
      class="pt-2 pb-2"
    >
      <v-card-actions
        class="mt-3 mb-3"
      >
        <v-btn color="teal lighten-2" @click="signIn">Sign in with Google</v-btn>
      </v-card-actions>
    </v-layout>
  </v-card>
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
