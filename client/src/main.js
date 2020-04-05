// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'es6-promise/auto'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import App from './App'
import router from './router'
import moment from 'moment'
import BootstrapVue from 'bootstrap-vue'
import FilePlusIcon from 'vue-material-design-icons/FilePlus.vue'
import FileIcon from 'vue-material-design-icons/File.vue'
import TableIcon from 'vue-material-design-icons/TableOfContents.vue'
import LogoutIcon from 'vue-material-design-icons/Logout.vue'
import EditIcon from 'vue-material-design-icons/Pencil.vue'
import PlusIcon from 'vue-material-design-icons/Plus.vue'
import MinusIcon from 'vue-material-design-icons/Minus.vue'
import StarIcon from 'vue-material-design-icons/Star.vue'
import HomeIcon from 'vue-material-design-icons/Home.vue'
import DecagramIcon from 'vue-material-design-icons/Decagram.vue'
import TimerIcon from 'vue-material-design-icons/Timer.vue'
import ChartTimeline from 'vue-material-design-icons/ChartTimeline.vue'
import MinimizeIcon from 'vue-material-design-icons/WindowMinimize.vue'
import LoadingIcon from 'vue-material-design-icons/Loading.vue'
import ArrowLeftIcon from 'vue-material-design-icons/ChevronLeft.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'
import Calendar from 'vue-material-design-icons/Calendar.vue'

import RecipeService from './services/RecipeService'
import UsersService from './services/UsersService'

import VueAnalytics from 'vue-analytics'

Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.use(Meta, {
  keyName: 'metaInfo',
  attribute: 'data-vue-meta',
  ssrAttribute: 'data-vue-meta-server-rendered',
  tagIDKeyName: 'vmid'
})
Vue.use(VueAnalytics, {
  id: 'UA-131216018-1',
  router,
  checkDuplicatedScript: true
})

Vue.component('file-plus-icon', FilePlusIcon)
Vue.component('file-icon', FileIcon)
Vue.component('table-icon', TableIcon)
Vue.component('logout-icon', LogoutIcon)
Vue.component('timer-icon', TimerIcon)
Vue.component('edit-icon', EditIcon)
Vue.component('plus-icon', PlusIcon)
Vue.component('minus-icon', MinusIcon)
Vue.component('star-icon', StarIcon)
Vue.component('home-icon', HomeIcon)
Vue.component('decagram-icon', DecagramIcon)
Vue.component('chart-timeline-icon', ChartTimeline)
Vue.component('minimize-icon', MinimizeIcon)
Vue.component('arrow-left-icon', ArrowLeftIcon)
Vue.component('loading-icon', LoadingIcon)
Vue.component('close-icon', CloseIcon)
Vue.component('calendar-icon', Calendar)

import 'vue-material-design-icons/styles.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

require('../static/style.css')

Vue.config.productionTip = false

let defaultTimer = window.localStorage.getItem('timer') ? JSON.parse(window.localStorage.getItem('timer')) : {
  start: null,
  end: null,
  timeLeft: 0,
  showing: false,
  minimize: false,
  finishTimeMax: null,
  finishTimeMin: null,
  t: null,
  ringing: false
}

const store = new Vuex.Store({
  state: {
    count: 0,
    recipes: null,
    addHours: 0,
    allRecords: null,
    recipe: {},
    userRecipe: {},
    startDate: null,
    endDate: null,
    authStatus: false,
    editing: true,
    editing_id: '',
    loadingMore: false,
    noRecords: false,
    timer: defaultTimer
  },
  mutations: {
    timer (state, params) {
      state.timer[params.prop] = params.val
      window.localStorage.setItem('timer', JSON.stringify(state.timer))
    },
    increment (state) {
      state.count++
    },
    authStatus (state, authStatus) {
      state.authStatus = authStatus
    },
    loadingMore (state, loadingMore) {
      state.loadingMore = loadingMore
    },
    userRating (state, userRating) {
      state.recipe.userRating = userRating
    },
    addHours (state, addHours) {
      state.addHours = addHours
    },
    startDate (state, startDate) {
      state.startDate = startDate
    },
    endDate (state, endDate) {
      state.endDate = endDate
    },
    userRecipe (state, params) {
      state.userRecipe = params.recipe
    },
    recipe (state, params) {
      state.recipe = params.recipe
      // if (record === null) {
      //   state.record = {
      //     _id: '',
      //     record_id: '',
      //     description: '',
      //     notes: '',
      //     date: '',
      //     children: [],
      //     attachments: []
      //   }
      // } else {
      //   state.record._id = record._id
      //   state.record.record_id = record.record_id
      //   state.record.description = record.description
      //   state.record.notes = record.notes
      //   state.record.date = record.date
      //   state.record.attachments = record.attachments
      //   state.record.children = record.children === null ? [] : record.children
      // }
    },
    parentAttachments (state, params) {
      if (!params) return
      if (!params.attachments) return
      for (var attachment of params.attachments) {
        state.record.attachments.push(attachment)
      }
    },
    childAttachments (state, params) {
      if (!params) return
      if (!params.attachments) return
      if (!params.record_id) return
      // Go through each child and find right one
      for (var child of state.record.children) {
        if (child.record_id === params.record_id) {
          // Push each attachment into it
          for (var childAttachment of params.attachments) {
            if (!child.attachments) child.attachments = []
            child.attachments.push(childAttachment)
          }
        }
      }
    },
    recipes (state, params) {
      if (params.append) {
        for (var newRecipe of params.recipes) {
          state.recipes.push(newRecipe)
        }
      } else {
        state.recipes = params.recipes
      }
    },
    allRecords (state, allRecipes) {
      state.recipes = allRecipes
    },
    editing (state, val) {
      state.editing = val
    },
    editing_id (state, val) {
      state.editing_id = val
    },
    noRecords (state, noRecords) {
      state.noRecords = noRecords
    }
  },
  actions: {
    logout (state) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      state.commit('authStatus', false)
      router.push({ name: 'Recipes' })
    },
    async auth (state) {
      if (!localStorage.getItem('token')) {
        // No token, so must log in
        state.commit('authStatusm', false)
        // state.dispatch('logout')
      } else {
        const response = await UsersService.auth({ token: localStorage.getItem('token') })
        if (response.data.success) {
          state.commit('authStatus', true)
        } else {
          // Invalid token, so must log in
          // state.dispatch('logout')
          state.commit('authStatus', false)
        }
      }
      // const token = localStorage.getItem('token')
      // this.auth = true
      // const response = await UsersService.auth({ token: token })
      // if (response.data.success) {
      //   this.auth = true
      // } else {
      //   this.auth = false
      //   this.$router.push({ name: 'login', params: { message: 'You must log in.' } })
      // }
    },
    async updateRecipe (state, params) {
      var response = await RecipeService.updateRecipe(params)
      state.commit('recipe', response.data)
      if (response.data.success) {
        router.push({path: '/recipe/' + response.data.recipe._id})
      }
    },
    async updateStarRating (state, params) {
      var response = await RecipeService.updateStarRating(params)
      state.commit('starRating', response.data)
    },
    async searchRecords (state, params) {
      if (params.filter === '') {
        // state.commit('records', state.allRecords)
        state.dispatch('getRecords')
        return
      }
      const response = await RecipeService.searchRecord({record_id: params.filter, username: localStorage.getItem('username')})
      state.commit('records', { records: response.data.records })
      state.commit('noRecords', response.data.records.legnth === 0)
    },
    async getRecipe (state, params) {
      // state.commit('editing_id', '')
      // state.commit('editing', false)
      // Use local if available otherwise set default on response as local
      var localRecipe = window.localStorage.getItem(params._id)
      // console.log('getting recipe...', localRecipe)
      if (localRecipe) {
        // console.log('saving')
        state.commit('recipe', {recipe: JSON.parse(localRecipe)})
      } else {
        const response = await RecipeService.getRecipe({
          id: params._id
        })
        console.log(response)
        state.commit('recipe', response.data)
        window.localStorage.setItem('original_' + params._id, JSON.stringify(response.data.recipe))
      }
    },
    async getRecipes (state, params) {
      // console.log('getting', params)
      if (!params) params = {}
      const response = await RecipeService.recipes(params)
      state.commit('loadingMore', false)
      state.commit('recipes', { recipes: response.data.recipes, append: params.append })
      // state.count = 10
      // console.log(state.records)
      // if (response.data.success) {
      //   if (append) {
      //     this.records = this.records.concat(response.data.records)
      //   } else {
      //     this.records = response.data.records
      //     // If no records and not part of an appaned, then there are no records so show warning
      //     if (this.records.length === 0) {
      //       this.noRecords = true
      //     }
      //   }
      //   this.allRecords = this.records
      //   // this.totalRows = this.records.length
      // } else if (response.data.redirect) {
      //   // window.location = response.data.redirect
      //   this.$router.push(response.data.redirect)
      // } else {
      //   // Default redirect : Only logged in users should be here
      //   // window.location = '/login'
      //   // this.$router.push('login')
      //   // ERR
      // }
    },
    async addRecipe (state, recipe) {
      var response = await RecipeService.addRecipe(recipe)
      if (response.data.success) {
        router.push({name: 'Recipes'})
      }
    },
    resetTimer (state) {
      // TODO
    },
    showTimer (state) {
      // Set timer to show
      state.commit('timer', {'prop': 'showing', 'val': true})
      state.commit('timer', {'prop': 'ringing', 'val': false})
      var intervalTime = () => {
        // Trigger loop to update the data, which will update teh time
        var diff = moment.duration(moment(state.state.timer.end).diff(moment()))
        if (moment(state.state.timer.end).diff(moment()) <= 0) {
          state.dispatch('endTimer')
          state.commit('timer', {'prop': 'timeLeft', 'val': '0:00'})
          state.commit('timer', {'prop': 'ringing', 'val': true})
          return
        }
        var hours = diff.hours()
        hours = hours === 0 ? '' : hours + ':'
        var minutes = diff.minutes()
        if (minutes < 10 && hours !== '') {
          // if (minutes === 0) {
          //   minutes += ''
          // } else {
          //   minutes = 0 ':'
          // }
          minutes = '0' + minutes
        }
        if (minutes !== '') {
          minutes += ':'
        }
        var seconds = diff.seconds()
        seconds = seconds < 10 ? '0' + seconds : seconds
        this.commit('timer', {'prop': 'timeLeft', 'val': hours + minutes + seconds})
      }
      var t = setInterval(() => {
        intervalTime()
      }, 500)
      intervalTime()
      state.commit('timer', {'prop': 't', 'val': t})
    },
    endTimer (state) {
      clearInterval(state.state.timer.t)
      this.commit('timer', {'prop': 't', 'value': null})
      window.localStorage.removeItem('timer')
    }
  }
})

// Edit writer
// router.beforeEach((to, from, next) => {
//   Vue.nextTick(() => {
//     console.log(to, from, to.meta.title, store.state.recipe)
//     var defaultTitle = 'Bread recipes, planner and timer for better sourdough'
//     var title = to.meta.title === 'recipe.title' ? store.state.recipe.title : defaultTitle
//     document.title = 'Bread Scheduler – ' + title
//   })
//   next()
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
