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
            row
            wrap
          >
            <v-select
              v-model="maxNumPerGroup"
              :items="maxNumPerGroupItems"
              label="グルーピング人数(default: 2)"
              solo
              dense
              flat
              hide-details
              type="number"
              suffix="人/組"
              v-if="!isLocked"
              class="maxNumSelect body-1"
            ></v-select>

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

        <MatchingList
          :post="post"
          v-if="post.lastEntryId"
        />
      </v-container>
    </v-layout>
</template>

<script>
import MatchingList from '~/components/posts/MatchingList.vue'
import h from 'htmlspecialchars'
import { link } from 'autolinker'
import { mapGetters, mapMutations } from 'vuex'
import axios from 'axios'
import * as R from 'ramda'

export default {
  components: {
    MatchingList,
  },
  async mounted() {
    this.setPageName('イベント詳細');
    await Promise.all([
      this.$store.dispatch('posts/INIT_POST', { id: this.$nuxt.$route.params.id })
    ]);
  },
  data: () => ({
    maxNumPerGroupItems: [2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20],
    maxNumPerGroup: 2,
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
  },
  methods: {
    ...mapMutations(['setPageName']),
    toggleLock: async function (event) {
      this.$store.dispatch('posts/SET_POST_STATE', {
        state: (this.isLocked)
          ? this.post.state.filter(v => v !== 'LOCKED')
          : this.post.state.concat(['LOCKED']),
        user: this.user,
        post: this.post,
      });
    },
    shuffle: async function (event) {
      await Promise.all([
        this.toggleLock(event),
        axios.get(`/functions/shuffleEntry/${this.post.id}`, {
          params: {
            maxNum: this.maxNumPerGroup,
          }
        }),
      ]).catch(err => alert(`エラーが発生しました。: ${err}`));
    },
  },
}
</script>

<style scoped>
  .maxNumSelect {
    max-width: 6rem !important;
  }
</style>
