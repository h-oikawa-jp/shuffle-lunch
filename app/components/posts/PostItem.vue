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
            posted by <strong>{{ post.createdBy.name }}</strong>({{ post.createdBy.email }})
          </span>
        </div>
        <div class="level-right">
          <a class="level-item">
            <a class="icon is-small" @click="shuffle"><i class="fa fa-random"></i></a>
          </a>
          <a class="level-item">
            <a class="icon is-small" @click="deletePost"><i class="fa fa-trash"></i></a>
          </a>
        </div>
      </nav>

      <div class="shuffles">
        <h3>組合せ結果</h3>
        <ul v-if="post.shuffles">
          <li v-for="(pairs, i) in post.shuffles">
            {{i}}組目: [
            <span v-for="user in pairs">
              <strong>{{ user.name }}</strong>({{ user.email }})
            </span>
            ]
          </li>
        </ul>
      </div>
    </div>
  </li>
</template>

<script>
  import h from 'htmlspecialchars'
  import { link } from 'autolinker'
  import axios from 'axios'

  export default {
    props: {
      user: Object,
      post: Object
    },
    computed: {
      formattedPost() {
        const nl2brBody = h(this.post.body)
          .replace(/\r\n/g, "<br />")
          .replace(/(\n|\r)/g, "<br />");
        return link(nl2brBody)
      }
    },
    methods: {
      shuffle: function (event) {
        axios.get(`/functions/shuffle/${this.post.id}`, {})
      },
      deletePost: function (event) {
        this.$store.dispatch('posts/DELETE_POST', {
          user: this.user,
          post: this.post,
        });
      }
    }
  }
</script>

<style scoped>
  .media {
    border-top: none;
    padding-bottom: 1rem;
  }

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
    font-size: 2rem;
    font-weight: bold;
  }

  .shuffles ul {
    border: solid 1px #e6e6e6;
    text-align: center;
    padding: 16px 0;

  }

  .shuffles span + span:before {
    content: " - ";
  }
</style>
