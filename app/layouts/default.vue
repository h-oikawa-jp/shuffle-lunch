<template>
  <div id="app">
    <div class="wrapper wrapper-loading" v-if="!isLoaded"><TheLoading /></div>
    <div class="wrapper wrapper-loaded" v-show="isLoaded"><nuxt /></div>
  </div>
</template>

<script>
import TheLoading from '~/components/TheLoading.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    TheLoading
  },
  computed: {
    ...mapGetters(['isLoaded'])
  }
}
</script>

<style scoped>
#app {
  background: #e6ecf0;
}
.wrapper {
  width: 100vw;
  min-height: 100vh;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  background: #fff;
  padding: 32px;
}
.wrapper-loaded {
  background: #fafafa;
  padding-top: 0;
}
</style>
