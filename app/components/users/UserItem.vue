<template lang="html">
  <li class="media" v-if="user">
    <figure class="media-left">
      <p class="image is-64x64"><img :src="user.icon" /></p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ user.name }}</strong> <br />
          <span>{{ user.email }}</span>
        </p>
      </div>
    </div>
  </li>
</template>

<script>
  export default {
    props: {
      user: Object
    },
  }
</script>

<style scoped>
  .media {
    border-top: none;
    margin-top: 0.5rem;
    padding: 1rem;
  }
  img {
    border-radius: 50%;
    overflow: hidden;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
