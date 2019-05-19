<template>
    <v-layout justify-space-around column fill-height>
      <v-container
        fluid
        grid-list-md
        v-if="user"
      >
        <v-avatar
          size="100"
          class="mb-4 elevation-6"
          color="grey lighten-4"
        >
          <img :src="user.icon" alt="avatar">
        </v-avatar>

        <v-text-field
          v-model="user.uid"
          label="uid"
          readonly
        ></v-text-field>

        <v-text-field
          v-model="user.name"
          label="name"
          readonly
        ></v-text-field>

        <v-text-field
          v-model="user.email"
          label="email"
          readonly
        ></v-text-field>

        <v-data-table
          :headers="headers"
          :items="usersMatchCount"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td class="text-xs-left">
              <v-list-tile-avatar color="grey darken-3">
                <v-img
                  class="elevation-6"
                  :src="props.item.icon"
                ></v-img>
              </v-list-tile-avatar>
            </td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">
              <v-edit-dialog
                v-if="self.uid === user.uid"
                :return-value.sync="props.item.count"
                large
                lazy
                persistent
                @save="save(props.item)"
                @cancel="cancel"
                @open="open"
                @close="close"
              > {{ props.item.count }}
                <template v-slot:input>
                  <v-text-field
                    v-model="props.item.count"
                    label="Edit"
                    single-line
                    autofocus
                  ></v-text-field>
                </template>
              </v-edit-dialog>
              <template v-else>
                {{ props.item.count }}
              </template>
            </td>
          </template>
        </v-data-table>

        <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
          {{ snackText }}
          <v-btn flat @click="snack = false">Close</v-btn>
        </v-snackbar>
      </v-container>
    </v-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import * as R from 'ramda'

export default {
  async mounted() {
    this.setPageName('ユーザ詳細');
    this.resetState();
    await Promise.all([
      this.$store.dispatch('users/INIT_USER', { id: this.$nuxt.$route.params.id })
    ]);
  },
  data: () => ({
    usersMatchCount: [],
    headers: [
      {
        sortable: false,
        value: 'icon'
      },
      {
        text: 'ユーザ名',
        value: 'name'
      },
      {
        text: 'メールアドレス',
        value: 'email'
      },
      {
        text: 'マッチ回数',
        value: 'count'
      },
    ],
    snack: false,
    snackColor: '',
    snackText: '',
  }),
  beforeUpdate() {
    if (R.isEmpty(this.usersMatchCount) && this.user && this.user.matchCount) {
      this.usersMatchCount = R.values(R.mapObjIndexed((count, key) => {
        const user = R.find(x => key === x.uid, this.users);
        return Object.assign({}, user, { count });
      }, this.user.matchCount));
    }
  },
  computed: {
    ...mapGetters({
      self: 'user',
      user: 'users/one',
      users: 'users/list',
    }),
  },
  methods: {
    ...mapMutations(['setPageName']),
    ...mapMutations({
      resetState: 'users/resetOne',
    }),
    save(target) {
      const { matchCount, uid } = this.user;
      const newMatchCount = Object.assign({}, matchCount);
      newMatchCount[target.uid] = target.count;
      this.$store.dispatch('users/UPDATE_MATCH_COUNT', {
        self: this.self,
        uid,
        newMatchCount,
      }).then(() => {
        this.snack = true;
        this.snackColor = 'success';
        this.snackText = 'Data saved';
      }).catch((e) => {
        console.error(e);
        this.snack = true;
        this.snackColor = 'error';
        this.snackText = 'Data save failed';
      });
    },
    cancel() {
      this.snack = true;
      this.snackColor = 'error';
      this.snackText = 'Canceled';
    },
    open() {
      this.snack = true;
      this.snackColor = 'info';
      this.snackText = 'Dialog opened';
    },
    close() {
      console.log('Dialog closed');
    },
  },
}
</script>
