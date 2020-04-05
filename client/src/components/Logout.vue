<template>
  <div class="login container-fluid p-5">
    <b-row>
      <b-col md="12 p-2">
          <h6>Logging you out</h6>
      </b-col>
    </b-row>
  </div>
</template>


<script>
export default {
  name: 'logout',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  mounted () {
    this.getLogout()
  },
  methods: {
    async getLogout () {
      console.log('logging out')
      this.$store.dispatch('logout')
    }
  }
}
</script>
