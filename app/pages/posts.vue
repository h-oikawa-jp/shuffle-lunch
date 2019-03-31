<template>
  <v-container fluid fill-height>
    <v-layout
      justify-center
      align-center
    >
      <ThePostList />
    </v-layout>
  </v-container>
</template>

<script>
import ThePostList from '~/components/ThePostList.vue'
import { mapMutations } from 'vuex'

export default {
  components: {
    ThePostList,
  },
  async mounted() {
    this.setPageName('イベント一覧');
  },
  methods: {
    ...mapMutations(['setPageName']),
  },
}
</script>
