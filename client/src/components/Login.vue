<template>
  <div class="login container-fluid p-3 p-sm-3 p-md-5">
    <b-row>
      <b-col class="mx-auto" lg="4" md="5" sm="6" xs="12">
        <h5 class="mt-4 text-center mb-4">
          Welcome. Please log in.
        </h5>
        <b-card>
          <b-form-group>
            <b-form @submit="login">
              <b-alert variant="danger" v-if="error" class="text-center" :show="error">Sorry, that didn't work. Try again.</b-alert>
              <b-input id="username" autofocus v-model="username" type="text" placeholder="Email" class="mb-3"></b-input>
              <b-input id="password" type="password" v-model="password" placeholder="Password" class="mb-3"></b-input>
              <b-button type="submit" variant="primary">Log In</b-button>
            </b-form>
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import UsersService from '@/services/UsersService'
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      error: '',
      success: '',
      message: ''
    }
  },
  created () {
  },
  mounted () {
    this.auth()
    this.getMessage()
  },
  methods: {
    auth () {
      // if (localStorage.getItem('token')) {
      //   this.$router.push({name: 'Records'})
      // }
      var userPromise = window.weasl.login()
      console.log(userPromise)
    },
    getMessage () {
      this.message = this.$route.params ? this.$route.params.message : ''
    },
    async getLogin () {
      const response = await UsersService.getLogin()
      this.error = response.data.error === 'invalid'
    },
    async login (e) {
      e.preventDefault()
      const response = await UsersService.login({username: this.username, password: this.password})
      this.error = !response.data.success
      this.success = response.data.success
      if (this.success) {
        if (response.data.token) {
          localStorage.removeItem('token')
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('username', response.data.username)
          // this.$root.$emit('authStatus', true)
          this.$store.commit('authStatus', true)
          if (response.data.redirect) {
            this.$nextTick(function () {
              this.$router.push(response.data.redirect)
            })
          }
        }
      }
    }
  }
}
</script>
