<template>
  <div id="app" class="">
    <div class="app-wrap">
      <div :class="timerClasses">
        <nav :class="timerNavClasses">
          <div @click="minimizeTimer" style="width:calc(100% - 40px); overflow:hidden" class="d-inline nav-title cursor float-left">
            <div style="width:999px" class="cursor text-left float-left" v-if="timer.minimize">{{ timer.timeLeft }}</div>
            <div style="width:999px" v-else class="cursor text-left float-left">{{ timer.title }}</div>
          </div>
          <span @click="minimizeTimer"><minimize-icon></minimize-icon></span>
          <span @click="closeTimer"><close-icon></close-icon></span>
        </nav>
        <div v-if="timer" class="border border-left-0 border-right-0 bg-white p-4 big-num text-primary">
          <timer-icon></timer-icon> {{ timer.timeLeft }}
        </div>
        <div class="pl-3 pr-3 pt-2 pb-2">
            <b-btn variant="link text-secondary" @click="stopTimer" size="sm">Stop</b-btn>
          <audio v-if="timer.ringing" autoplay loop class="d-none">
            <source src="/static/alarm.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </div>
      <div class="nav-bar ml-0 mr-0 ml-sm-5 mr-sm-5 p-3 text-dark text-large">
        <router-link to="/" class="text-primary logo"><timer-icon></timer-icon>Bread Scheduler</router-link>
        <div class="float-right mt-1 mt-sm-2 ml-4"><a href="http://www.breadscheduler.com/#/recipe/5e89e208aa3c8d002393a317" class="text-dark"><span class="d-md-inline">Make a starter</span></a></div>
        <div class="d-none d-sm-none d-md-block float-right mt-1 mt-sm-2 ml-4"><router-link to="/" class="text-dark">All our recipes</router-link></div>
        <div class="float-right mt-1 mt-sm-2 ml-4"><router-link to="/contact" class="text-dark">About <span class="d-none d-md-inline">Bread Scheduler</span></router-link></div>
      </div>
      <router-view></router-view>
      <div class="container">
        <b-row class="p-4 m-4"></b-row>
      </div>
      <div class="m-5">&nbsp;</div>
    </div>
    <footer class="footer mt-5 page-footer bg-dark text-light">
      <div class="footer-copyright text-thin text-medium bg-dark p-3">
        <div class="container ml-2">
          <div class="row">
            <div class="col">
              <timer-icon></timer-icon> Bread Scheduler © {{ year }}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import NewsFeed from '@/components/NewsFeed'
import EditRecipe from '@/components/EditRecipe'
import AddRecipe from '@/components/AddRecipe'
import moment from 'moment'

export default {
  name: 'app',
  metaInfo: {
    title: 'Bread Scheduler: Bread recipes, planner and timer for better sourdough'
  },
  data () {
    return {
      message: this.$route.params,
      currRoute: this.$route.name
    }
  },
  components: {
    EditRecipe,
    AddRecipe,
    NewsFeed
  },
  created () {
  },
  watch: {
    '$route' (to, from) {
      // Force a change to records on back button when hash is cleared...
      if (to.path === '/') {
        this.$store.commit('editing', false)
        this.$router.push({ name: 'Recipes' })
        this.$store.commit('editing_id', '')
        this.$store.commit('record', null)
      } else if (to.name === 'EditRecipe') {
        var record = {_id: to.params.id}
        if (record._id !== '') {
          this.$router.push({ path: to.path })
          this.$store.dispatch('getRecord', record)
        }
      }
    }
  },
  updated () {
  },
  computed: {
    year: function () {
      return new Date().getFullYear()
    },
    timerNavClasses: function () {
      var cl = 'p-2 text-light shadow-md text-right'
      if (this.$store.state.timer.minimize) {
        cl += ' bg-dark'
      } else if (this.$store.state.timer.showing) {
        cl += ' bg-primary'
      }
      return cl
    },
    timerClasses: function () {
      var cl = 'timer shadow-sm bg-light text-center'
      if (this.$store.state.timer.minimize) {
        cl += ' minimize'
      } else if (this.$store.state.timer.showing) {
        cl += ' show'
      }
      if (this.$store.state.timer.ringing) {
        cl += ' text-secondary'
      }
      return cl
    },
    timer: function () {
      return this.$store.state.timer
    },
    title: function () {
      return this.$store.state.recipe.title
    }
  },
  mounted () {
    // this.$store.dispatch('auth')
    this.checkTimer()
  },
  methods: {
    adjustTime: function (mins) {
      var newEnd = moment(this.$store.state.timer.end).add(mins, 'm')
      newEnd = newEnd.diff(moment(), 's') < 0 ? moment() : newEnd
      // var max = timeBreak.timeMax
      this.$store.commit('timer', {'prop': 'end', 'val': newEnd})
      this.$store.dispatch('showTimer')
    },
    endTimer: function () {
      this.$store.dispatch('endTimer')
    },
    checkTimer: function () {
      if (this.$store.state.timer.showing) {
        this.showTimer()
      }
    },
    showTimer: function () {
      this.$store.dispatch('showTimer')
    },
    stopTimer: function () {
      this.$store.commit('timer', {'prop': 'ringing', 'val': false})
      this.endTimer()
    },
    resetTimer: function () {
      // TODO
    },
    closeTimer: function () {
      this.$store.commit('timer', {'prop': 'showing', 'val': false})
      this.$store.commit('timer', {'prop': 'minimize', 'val': false})
      this.$store.commit('timer', {'prop': 'ringing', 'val': false})
      this.endTimer()
    },
    minimizeTimer: function () {
      this.$store.commit('timer', {'prop': 'minimize', 'val': !this.$store.state.timer.minimize})
    },
    openRecipe: function (recipe) {
      this.$router.push('recipe/' + recipe._id + '/edit')
    },
    clearRecord () {
      this.$store.commit('editing_id', '')
      this.$store.commit('record', null)
      this.$router.push({ name: 'Records' })
    },
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>
