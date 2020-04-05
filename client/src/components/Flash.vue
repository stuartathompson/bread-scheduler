<template>
  <div class="login container-fluid p-5">
    <b-row>
      <b-col md="4">
        <h4>Login {{ username }}</h4>
        <b-card>
          <b-form-group>
            <b-input id="username" v-model="username" type="text" placeholder="Username" class="mb-3"></b-input>
            <b-input id="password" type="password" v-model="password" placeholder="Password" class="mb-3"></b-input>
            <b-button @click="signIn" type="submit" variant="primary">Log In</b-button>
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import UsersService from '@/services/UsersService'
export default {
  name: 'flash',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  mounted () {
    this.getFlash()
  },
  methods: {
    async getFlash () {
      let response = await UsersService.flash()
      console.log(response)
    }
  }
}
</script>
