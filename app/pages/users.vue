<template>
  <v-container fluid fill-height>
    <v-layout
      justify-center
      align-center
    >

      <v-data-table
        :headers="headers"
        :items="users"
        :pagination.sync="pagination"
        item-key="uid"
        class="users elevation-1"
      >
        <template v-slot:items="props">
          <tr>
            <td>
              <v-list-tile-avatar color="grey darken-3">
                <v-img
                  class="elevation-6"
                  :src="props.item.icon"
                ></v-img>
              </v-list-tile-avatar>
            </td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.email }}</td>
          </tr>
        </template>
      </v-data-table>

    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data: () => ({
    pagination: {
      rowsPerPage: 10,
      sortBy: 'name',
    },
    headers: [
      { text: '', value: 'avatar', align: 'left', sortable: false },
      { text: '名前', value: 'name' },
      { text: 'メールアドレス', value: 'email' },
    ],
  }),
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
</style>
