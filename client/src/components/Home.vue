<template>
  <div>
      <h3 class="mb-4">Welcome home</h3>
      <router-link v-bind:to="{ name: 'Records' }" class="">See Records</router-link>
      <router-view></router-view>
  </div>
</template>

<script>
  export default{
    components: {
    }
  }
</script>
