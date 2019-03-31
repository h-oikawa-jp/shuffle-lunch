<template lang="html">
  <section class="hero is-medium is-primary is-bold">
    <div class="hero-head">
      <div class="has-text-left">
        <h1 class="title">イベント一覧</h1>
      </div>
    </div>
    <ul class="posts">
      <transition-group name="post">
        <AppPost
          class="post"
          :post="post"
          :key="post.id"
          v-for="post in posts"
        />
      </transition-group>
    </ul>
    <ThePostArea class="post-area" v-if="!!user" />
  </section>
</template>

<script>
  import AppPost from '~/components/AppPost.vue'
  import { mapGetters } from 'vuex'
  import ThePostArea from '~/components/ThePostArea.vue'

  export default {
    components: {
      AppPost,
      ThePostArea
    },
    async mounted() {
      await Promise.all([
        this.posts.length ? Promise.resolve() : this.$store.dispatch('posts/INIT_POSTS')
      ]);
    },
    computed: {
      ...mapGetters(['user']),
      ...mapGetters('posts', {
        posts: 'list'
      })
    }
  }
</script>

<style scoped>
  .hero {
    padding: 0.5rem;
    border: solid 1px #e6e6e6;
  }
  .hero-head {
    border-bottom: solid 1px #e6e6e6;
    line-height: 3rem;
  }
  .posts {
    padding: 1rem;
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
