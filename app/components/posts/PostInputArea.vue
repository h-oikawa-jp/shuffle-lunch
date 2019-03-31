<template lang="html">
  <div class="field-wrapper">
    <form class="field is-grouped" @submit.prevent="doPost">
      <p class="control is-expanded">
        <input
          class="input"
          type="text"
          placeholder="Post New Event"
          v-model="body"
        />
      </p>
      <p class="control">
        <button class="button is-primary" :disabled="!this.body">Post</button>
      </p>
    </form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        body: ''
      }
    },
    computed: {
      ...mapGetters(['user'])
    },
    methods: {
      async doPost() {
        if (!this.body) return;
        await this.$store.dispatch('posts/ADD_POST', {
          user: this.user,
          body: this.body,
        });
        this.body = ''
      }
    }
  }
</script>
