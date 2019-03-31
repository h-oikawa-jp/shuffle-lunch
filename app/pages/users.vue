<template>
  <v-container fluid fill-height>
    <v-layout
      justify-center
      align-center
    >
      <ul class="list users">
        <transition-group name="user">
          <UserItem
            class="list-item user"
            :user="user"
            :key="user.uid"
            v-for="user in users"
            v-if="user.uid"
          />
        </transition-group>
      </ul>
    </v-layout>
  </v-container>
</template>

<script>
import UserItem from '~/components/users/UserItem.vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    UserItem,
  },
  async mounted() {
    this.setPageName('ユーザ一覧');
    await Promise.all([
      this.users.length ? Promise.resolve() : this.$store.dispatch('users/INIT_USERS')
    ]);
  },
  computed: {
    ...mapGetters('users', {
      users: 'list'
    })
  },
  methods: {
    ...mapMutations(['setPageName']),
  },
}
</script>

<style scoped>
  .users {
    width: 100%;
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
