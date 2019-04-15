<template lang="html">
  <v-card>
    <v-card-title>
      <nuxt-link :to="detailLink">
        <h3 class="heading">{{post.title}}</h3>
      </nuxt-link>
    </v-card-title>

    <v-card-text v-if="post.body">
      <p v-html="formattedPost"></p>
    </v-card-text>

    <v-card-actions v-if="user">
      <v-list-tile class="grow">
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
            color="red"
            v-if="!isLocked"
            @click="deletePost"
          >
            <v-icon>delete</v-icon>
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
    </v-card-actions>

  </v-card>
</template>

<script>
  import h from 'htmlspecialchars'
  import { link } from 'autolinker'
  import * as R from 'ramda'

  export default {
    props: {
      user: Object,
      post: Object
    },
    computed: {
      isLocked() {
        return R.includes('LOCKED', this.post.state);
      },
      formattedPost() {
        const nl2brBody = h(this.post.body)
          .replace(/\r\n/g, "<br />")
          .replace(/(\n|\r)/g, "<br />");
        return link(nl2brBody)
      },
      detailLink() {
        return `/posts/${this.post.id}`
      },
    },
    methods: {
      toggleLock: function (event) {
        this.$store.dispatch('posts/SET_POST_STATE', {
          state: (this.isLocked)
            ? this.post.state.filter(v => v !== 'LOCKED')
            : this.post.state.concat(['LOCKED']),
          user: this.user,
          post: this.post,
        });
      },
      deletePost: function (event) {
        const res = confirm('イベント[' + this.post.title + ']を削除します。本当によろしいですか？');
        if( res === true ) {
          this.$store.dispatch('posts/DELETE_POST', {
            user: this.user,
            post: this.post,
          });
        }
      }
    }
  }
</script>
