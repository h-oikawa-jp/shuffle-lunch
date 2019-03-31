<template lang="html">
  <div class="field-wrapper">
    <v-form class="field is-grouped">
      <p class="control is-expanded">
        <v-textarea
          name="input-post-body"
          rows="1"
          auto-grow
          color="teal accent-4"
          label="Post New Event"
          v-model="body"
        ></v-textarea>
      </p>
      <p class="control">
        <v-btn
          large
          :disabled="!this.body"
          color="teal accent-4"
          @click="doPost"
        >Post</v-btn>
      </p>
    </v-form>
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
