<template>
  <v-app id="app">
      <v-navigation-drawer
        class="teal lighten-5"
        fixed
        v-model="drawer"
        app
      >
        <v-layout
          justify-center
        >
          <h1 class="headline font-weight-bold primary--text">
            Shuffle Lunch
          </h1>
        </v-layout>

        <ThePageLinks />

        <div v-if="!isAccountLoaded"><TheLoading /></div>
        <div v-show="isAccountLoaded"><TheUserInfo /></div>
      </v-navigation-drawer>

      <v-toolbar color="teal" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>
          <h2 class="subheading font-weight-bold">{{pageName}}</h2>
        </v-toolbar-title>
      </v-toolbar>

      <v-content class="teal lighten-4">
        <nuxt />
      </v-content>

    <v-footer color="teal" dark app>
      <v-layout
        justify-center
        align-center
      >
        <span>&copy; 2019 hiroyuki-oikawa</span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import TheLoading from '~/components/TheLoading.vue'
import ThePageLinks from '~/components/menu/ThePageLinks.vue'
import TheUserInfo from '~/components/menu/TheUserInfo.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      drawer: null
    }
  },
  components: {
    TheLoading,
    ThePageLinks,
    TheUserInfo,
  },
  async mounted() {
    await Promise.all([
      this.user
        ? Promise.resolve()
        : this.SET_CREDENTIAL(),
    ]);
  },
  computed: {
    ...mapGetters(['pageName', 'user', 'isAccountLoaded'])
  },
  methods: {
    ...mapActions(['SET_CREDENTIAL'])
  },
}
</script>
