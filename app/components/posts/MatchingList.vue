<template lang="html">
  <v-data-iterator
    v-if="groups.length > 0"
    :items="groups"
    :rows-per-page-items="rowsPerPageItems"
    :pagination.sync="pagination"
    content-tag="v-layout"
    row
    wrap
    class="shuffles white mt-3 elevation-1"
  >
    <template v-slot:header>
      <v-toolbar>
        <v-toolbar-title>組合せ結果</v-toolbar-title>
      </v-toolbar>
    </template>

    <template v-slot:item="groups">
      <v-flex
        xs12
        md6
      >
        <v-card>
          <v-card-title class="subheading font-weight-bold">{{groups.item.groupNumber}}組目</v-card-title>

          <v-divider></v-divider>

          <v-list dense>
            <v-list-tile
              v-for="user in groups.item.members"
              class="mt-2 mb-2"
            >
              <v-list-tile-avatar color="grey darken-3">
                <v-img
                  class="elevation-6"
                  :src="user.icon"
                ></v-img>
              </v-list-tile-avatar>

              <v-list-tile-content
                v-if="user.name || user.email"
              >
                <v-list-tile-title>{{ user.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ user.email }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content
                v-else
              >
                <v-list-tile-title>ユーザ情報はログイン後に見られるようになります</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </template>
  </v-data-iterator>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    props: {
      postId: String,
      entryId: String,
    },
    data: () => ({
      rowsPerPageItems: [2, 4, 8, 16],
      pagination: {
        sortBy: 'groupNumber',
        rowsPerPage: 2
      },
    }),
    async mounted() {
      this.setEntryId(this.entryId);
      await Promise.all([
        this.$store.dispatch('entries/INIT_ENTRIES', { postId: this.postId })
      ]);
    },
    computed: {
      ...mapGetters({
        entry: 'entries/entry',
      }),
      groups() {
        return this.entry.groups || [];
      },
    },
    methods: {
      ...mapMutations({
        resetState: 'entries/resetState',
        setEntryId: 'entries/setEntryId',
      }),
    },
  }
</script>
