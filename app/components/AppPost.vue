<template lang="html">
  <li class="media" v-if="post">
    <div class="media-content">
      <div class="content">
        <p class="body">
          <span v-html="formattedPost" />
        </p>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <span v-if="post.createdBy">
            posted by <strong>{{ post.createdBy.name }}</strong> ({{ post.createdBy.email }})
          </span>
        </div>
        <div class="level-right">
          <a class="level-item">
            <a class="icon is-small" @click="unregister"><i class="fa fa-trash"></i></a>
          </a>
        </div>
      </nav>
    </div>
  </li>
</template>

<script>
  import h from 'htmlspecialchars'
  import { link } from 'autolinker'

  export default {
    props: {
      post: Object
    },
    computed: {
      formattedPost() {
        return link(h(this.post.body))
      }
    },
    methods: {
      unregister: function (event) {
        alert('TODO(未実装): Delete Post [' + this.post.id + ']');
      }
    }
  }
</script>

<style scoped>
  img {
    border-radius: 50%;
    overflow: hidden;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .body {
    display: inline-block;
    margin-top: 6px;
  }
</style>
