<template>
    <v-layout justify-space-around column fill-height>
      <v-container
        fluid
        grid-list-md
        v-if="post"
      >
        <h3 class="heading">{{post.title}}</h3>

        <v-container
          v-if="post.body"
        >
          <p v-html="formattedPost"></p>
        </v-container>

        <v-list-tile
          v-if="user"
          class="grow"
        >
          <v-list-tile-action-text v-if="post.createdBy">
            posted by <strong>{{ post.createdBy.name }}</strong> ({{ post.createdBy.email }})
          </v-list-tile-action-text>

          <v-layout
            align-center
            justify-end
          >
            <v-btn
              fab
              dark
              small
              color="indigo"
              v-if="!isLocked"
              @click="shuffle"
            >
              <v-icon>shuffle</v-icon>
            </v-btn>

            <v-btn
              fab
              dark
              small
              color="green"
              v-if="isLocked"
              @click="toggleLock"
            >
              <v-icon>fa-lock</v-icon>
            </v-btn>

            <v-btn
              fab
              dark
              small
              color="green"
              v-if="!isLocked"
              @click="toggleLock"
            >
              <v-icon>fa-unlock</v-icon>
            </v-btn>
          </v-layout>
        </v-list-tile>

        <v-data-iterator
          v-if="shuffledGroups.length !== 0"
          :items="shuffledGroups"
          :rows-per-page-items="rowsPerPageItems"
          :pagination.sync="pagination"
          content-tag="v-layout"
          row
          wrap
          class="shuffles white mt-3 elevation-1"
        >
          <template v-slot:header>
            <v-toolbar>
              <v-toolbar-title>組合せ結果</v-toolbar-title>
            </v-toolbar>
          </template>

          <template v-slot:item="groups">
            <v-flex
              xs12
              md6
            >
              <v-card>
                <v-card-title class="subheading font-weight-bold">{{groups.item.index + 1}}組目</v-card-title>

                <v-divider></v-divider>

                <v-list dense>
                  <v-list-tile
                    v-for="user in groups.item.users"
                    class="mt-2 mb-2"
                  >
                    <v-list-tile-avatar color="grey darken-3">
                      <v-img
                        class="elevation-6"
                        :src="user.icon"
                      ></v-img>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title>{{ user.name }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ user.email }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </template>
        </v-data-iterator>
      </v-container>
    </v-layout>
</template>

<script>
import h from 'htmlspecialchars'
import { link } from 'autolinker'
import { mapGetters, mapMutations } from 'vuex'
import axios from 'axios'
import * as R from 'ramda'

export default {
  async mounted() {
    this.setPageName('イベント詳細');
    await Promise.all([
      this.$store.dispatch('posts/INIT_POST', { id: this.$nuxt.$route.params.id })
    ]);
  },
  data: () => ({
    rowsPerPageItems: [2, 4, 8, 16],
    pagination: {
      rowsPerPage: 2
    },
  }),
  computed: {
    ...mapGetters(['user']),
    ...mapGetters({
      post: 'posts/one'
    }),
    isLocked() {
      return R.includes('LOCKED', this.post.state);
    },
    formattedPost() {
      const nl2brBody = h(this.post ? this.post.body : "")
        .replace(/\r\n/g, "<br />")
        .replace(/(\n|\r)/g, "<br />");
      return link(nl2brBody)
    },
    shuffledGroups() {
      return this.post ? R.values(this.post.shuffles).map((users, index) => {
        return { users, index }
      }) : []
    },
  },
  methods: {
    ...mapMutations(['setPageName']),
    toggleLock: function (event) {
      this.$store.dispatch('posts/SET_POST_STATE', {
        state: (this.isLocked)
          ? this.post.state.filter(v => v !== 'LOCKED')
          : this.post.state.concat(['LOCKED']),
        user: this.user,
        post: this.post,
      });
    },
    shuffle: function (event) {
      axios.get(`/functions/shuffle/${this.post.id}`, {})
        .then(this.toggleLock)
    },
  },
}
</script>

<style scoped>
  @keyframes slideIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
