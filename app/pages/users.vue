<template>
  <section class="container">
    <div class="columns">
      <div class="column is-narrow is-3" >
        <div class="title-logo" >
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
        <TheUserList class="section" />
      </div>
    </div>
  </section>
</template>

<script>
import TheUserInfo from '~/components/TheUserInfo.vue'
import TheUserList from '~/components/TheUserList.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TheUserInfo,
    TheUserList,
  },
  async mounted() {
    await Promise.all([
      this.user
        ? Promise.resolve()
        : this.$store.dispatch('SET_CREDENTIAL'),
    ]);
    this.loadComplete();
  },
  computed: {
    ...mapGetters(['user', 'isLoaded'])
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

