<template lang="html">
  <section class="hero is-medium is-primary is-bold">
    <div class="hero-head">
      <div class="has-text-left">
        <h1 class="title">ユーザ一覧</h1>
      </div>
    </div>
    <ul class="users">
      <transition-group name="user">
        <AppUser
          class="user"
          :user="user"
          :key="user.uid"
          v-for="user in users"
          v-if="user.uid"
        />
      </transition-group>
    </ul>
  </section>
</template>

<script>
  import AppUser from '~/components/AppUser.vue'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      AppUser
    },
    async mounted() {
      await Promise.all([
        this.users.length ? Promise.resolve() : this.$store.dispatch('users/INIT_USERS')
      ]);
    },
    computed: {
      ...mapGetters('users', {
        users: 'list'
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
  .users {
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
