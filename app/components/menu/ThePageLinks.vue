<template lang="html">
  <v-list
    class="pl-4"
    dense
  >
    <nuxt-link to="/posts">
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="subheading ">Events</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </nuxt-link>
    <nuxt-link to="/users">
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>group</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="subheading">Users</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </nuxt-link>
  </v-list>
</template>
