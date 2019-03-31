<template lang="html">
  <v-list
    class="menu-links pl-4 font-weight-bold"
    dense
  >
    <nuxt-link to="/posts">
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Events</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </nuxt-link>
    <nuxt-link to="/users">
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>group</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Users</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </nuxt-link>
  </v-list>
</template>

<style scoped>
  .menu-links {
    border-top: lightgrey solid 1px;
    border-bottom: lightgrey solid 1px;
  }
</style>
