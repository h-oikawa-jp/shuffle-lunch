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
            <a class="icon is-small" @click="shuffle"><i class="fa fa-random"></i></a>
          </a>
          <a class="level-item">
            <a class="icon is-small" @click="deletePost"><i class="fa fa-trash"></i></a>
          </a>
        </div>
      </nav>

      <v-data-table
        v-model="selected"
        :headers="headers"
        :pagination.sync="pagination"
        :items="shuffledGroups"
        class="shuffles elevation-1"
        v-if="post.shuffles"
      >
        <template v-slot:headers="props">
          <tr>
            <th class="caption font-weight-bold">組合せ結果</th>
            <th
              v-for="header in props.headers"
              :key="header.text"
            >
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template v-slot:items="groups">
          <td>
            {{groups.index+1}}組目
          </td>
          <td v-for="user in groups.item">
            <div class="media">
              <figure class="media-left">
                <p class="image is-32x32"><img :src="user.icon" /></p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ user.name }}</strong> <br />
                    <span>{{ user.email }}</span>
                  </p>
                </div>
              </div>
            </div>
          </td>
        </template>
      </v-data-table>
    </div>
  </li>
</template>

<script>
  import h from 'htmlspecialchars'
  import { link } from 'autolinker'
  import axios from 'axios'
  import * as R from 'ramda'

  export default {
    props: {
      user: Object,
      post: Object
    },
    data: () => ({
      pagination: {},
    }),
    computed: {
      formattedPost() {
        const nl2brBody = h(this.post.body)
          .replace(/\r\n/g, "<br />")
          .replace(/(\n|\r)/g, "<br />");
        return link(nl2brBody)
      },
      headers() {
        const maxGroupRange = Math.max.apply(null, R.values(this.post.shuffles).map(x => x.length));
        return R.map(i => {
          return { text: i + '人目', value: i, sortable: false }
        }, R.range(1, maxGroupRange+1))
      },
      shuffledGroups() {
        return R.values(this.post.shuffles)
      },
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

  .shuffles table td, table th {
    vertical-align: middle;
  }
</style>
