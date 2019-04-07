<template>
  <v-container column fill-height>
    <v-layout justify-space-around column fill-height>
        <PostInputArea class="post-area" v-if="!!user" />

        <v-list
          class="list posts transparent"
        >
          <transition-group name="post">
            <PostItem
              class="list-item post mb-1"
              :user="user"
              :post="post"
              :key="post.id"
              v-for="post in posts"
            />
          </transition-group>
        </v-list>
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
  @keyframes slideIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
