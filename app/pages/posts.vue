<template>
  <v-container column fill-height>
    <v-layout justify-space-around column fill-height>
        <PostInputArea class="post-area" v-if="!!user" />

        <ul class="list posts">
          <transition-group name="post">
            <PostItem
              class="list-item post"
              :user="user"
              :post="post"
              :key="post.id"
              v-for="post in posts"
            />
          </transition-group>
        </ul>
    </v-layout>
  </v-container>
</template>

<script>
import PostItem from '~/components/posts/PostItem.vue'
import PostInputArea from '~/components/posts/PostInputArea.vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    PostItem,
    PostInputArea,
  },
  async mounted() {
    this.setPageName('イベント一覧');
    await Promise.all([
      this.posts.length ? Promise.resolve() : this.$store.dispatch('posts/INIT_POSTS')
    ]);
  },
  computed: {
    ...mapGetters(['user']),
    ...mapGetters('posts', {
      posts: 'list'
    })
  },
  methods: {
    ...mapMutations(['setPageName']),
  },
}
</script>

<style scoped>
  .post-area {
    margin-bottom: 1rem;
  }
  @keyframes slideIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
