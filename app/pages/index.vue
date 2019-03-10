<template>
  <section class="container">
    <div class="columns">
      <div class="column is-narrow is-3" >
        <div class="title-logo" >
          <app-logo/>
          <h1 class="title">
            Shuffle Lunch
          </h1>
          <h2 class="subtitle">
            demo-201903
          </h2>
        </div>

        <TheUserInfo />
      </div>

      <div class="column is-narrow is-9" >
        <ThePostList class="section" />
        <TheUserList class="section" />
      </div>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import TheUserInfo from '~/components/TheUserInfo.vue'
import ThePostList from '~/components/ThePostList.vue'
import TheUserList from '~/components/TheUserList.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    AppLogo,
    TheUserInfo,
    ThePostList,
    TheUserList,
  },
  async mounted() {
    await Promise.all([
      this.user
        ? Promise.resolve()
        : this.$store.dispatch('SET_CREDENTIAL'),
      this.posts.length ? Promise.resolve() : this.$store.dispatch('INIT_POSTS'),
      this.users.length ? Promise.resolve() : this.$store.dispatch('INIT_USERS')
    ]);
    this.loadComplete();
  },
  computed: {
    ...mapGetters(['user', 'users', 'posts', 'isLoaded'])
  },
  methods: {
    ...mapActions(['loadComplete'])
  }
}
</script>

<style scoped>
  .column + .column {
    margin-left: 1rem;
  }

  .title-logo .title {
    font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
    display: block;
    font-size: 32px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .title-logo .subtitle {
    font-size: 28px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }

  .section + .section {
    margin-top: 1rem;
  }
</style>

