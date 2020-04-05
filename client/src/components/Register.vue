<template>
  <div class="login container-fluid p-5">
    <b-row>
      <b-col class="mx-auto" lg="4" md="5" sm="6" xs="12">
        <h5 class="mt-4 mb-4 text-center">Register</h5>
        <b-card>
          <b-form-group>
            <b-form @submit="register">
              <b-input class="mb-3" id="username" v-model="username" type="text" placeholder="Username"></b-input>
              <b-input class="mb-3" id="password" type="password" v-model="password" placeholder="Password"></b-input>
              <b-button type="submit" variant="primary">Register</b-button>
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
  name: 'register',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  mounted () {
  },
  methods: {
    async register () {
      console.log('ok trying')
      const response = await UsersService.register({username: this.username, password: this.password})
      console.log(response)
      if (this.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
      } else {
        if (response.data.redirect) {
          // window.location.href = response.data.redirect
          this.$router.push(response.data.redirect)
        }
      }
    }
  }
}
</script>
