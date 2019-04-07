<template lang="html">
  <v-form class="">
    <v-text-field
      label="Title"
      required
      v-model="title"
    ></v-text-field>

    <v-textarea
      name="input-post-body"
      rows="1"
      auto-grow
      color="teal"
      label="Body"
      v-model="body"
    ></v-textarea>

    <v-btn
      large
      :disabled="!this.title"
      color="teal accent-4"
      @click="doPost"
    >Post</v-btn>
  </v-form>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        title: '',
        body: '',
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
          title: this.title,
          body: this.body,
        });
        this.title = '';
        this.body = '';
      }
    }
  }
</script>
