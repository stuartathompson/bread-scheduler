<template>
  <div class="recipes">
    <div
      v-if="recipes && index === 0"
      v-for="(recipe, index) of recipes" class="d-none d-sm-block cover mb-5"
      :style="'background-image:url(' + image(recipe) + ')'">
      <b-card no-body @click="openRecipe(recipe)" class="text-center recipes-card cursor cover-card bg-light">
        <b-card-body class="p-4">
          <h2><b-link v-html="noWidows(recipe.title)"></b-link></h2>
          <p class="card-text">
            {{ recipe.shortDescription }}
          </p>
          <p class="text-medium tighter-spacing text-primary">
            <!-- Start {{ recipe.recommendedTimes && recipe.recommendedTimes[0] ? recipe.recommendedTimes[0].startTime : 'now' | hoursToTime }}, eat this bread<br /><span v-html="endTime(recipe)"></span> -->
          </p>
          <!-- <div class="pb-2">
            <star-icon v-for="i in [1, 2, 3, 4, 5]"></star-icon>
          </div> -->
          <!-- <b-link class="text-bold text-caps text-dark">Start now »</b-link> -->
          <b-btn variant="primary" size="sm">Start now</b-btn>
        </b-card-body>
      </b-card>
    </div>
    <b-container fluid>
      <b-row>
        <b-col class="mt-3 mb-sm-5 mb-4 text-sm-center text-left">
          <h2 class="d-none d-sm-block">Bread Scheduler helps you make sourdough.</h2>
          <h2 class="d-block d-sm-none">Sourdough made easier.</h2>
          <b-row>
            <b-col sm="8 m-auto" md="7 m-auto">
              <p class="text-large">
                We take bread recipes and time them for an easier bake. Use these tools, timers and schedulers help you make bread.
              </p>
              <hr class="d-block d-sm-none" />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col v-if="recipes" v-for="(recipe, index) of recipes" :class="cardClasses(index)" sm="6" md="4">
          <b-card
          @click="openRecipe(recipe)"
          :title="recipe.title"
          :img-src="image(recipe) | thumbnail"
          class="recipes-card cursor">
            <div v-if="index === 3" class="decagram d-absolute text-extra-large text-primary starred-recipe">
              <decagram-icon></decagram-icon>
            </div>
            <p class="mb-2 md-3 card-text">
              <span class="text-strong" v-if="index === 3">
                Baker Favorite!
              </span>
              {{ recipe.shortDescription }}
            </p>
            <!-- <p class="pt-1 mb-0 text-medium">
              Finish <span v-html="timeUntilDone(recipe)"></span>
            </p> -->
        </b-card>
        </b-col>
      </b-row>
    </b-container>
    <!-- <Explainer :initialRecipe="recipes[0]" v-if="recipes"></Explainer> -->
    <!-- <b-container class="pt-5 mt-5">
      <b-row>
        <b-col>
          <h4 class="mb-4">Recommended Recipes</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-for="(recipe, index) of recipes" :class="cardClasses(index)" sm="3" md="3">
          <b-card
          @click="openRecipe(recipe)"
          :title="recipe.title"
          :img-src="image(recipe) | thumbnail"
          class="recipes-card cursor small-card">
          </b-card>
        </b-col>
      </b-row>
    </b-container> -->
  </div>
</template>
<script>
// import RecordsService from '@/services/RecordsService'
import moment from 'moment'
import Vue from 'vue'
import TimerIcon from 'vue-material-design-icons/Timer.vue'
import Explainer from '@/components/Explainer'
var ComponentClass = Vue.extend(TimerIcon)
var instance = new ComponentClass()
export default {
  name: 'Recipes',
  data () {
    return {
      data: [],
      getImage: function () {
        var sel = Math.round((Math.random() * 3) + 1)
        return 'static/bread' + sel + '.jpg'
      }
    }
  },
  components: {
    TimerIcon,
    Explainer
  },
  created () {
    this.$store.dispatch('getRecipes')
  },
  beforeMount () {
  },
  mounted () {
  },
  filters: {
    hours: function (value) {
      return Math.round(value / 60) + ' hours'
    },
    hoursToTime: function (hours) {
      console.log(hours)
      return isNaN(Number(hours)) ? hours : 'at ' + moment().startOf('day').add(hours, 'h').format('h A').replace('AM', 'a.m.').replace('PM', 'p.m.')
    },
    calendar: function (startDate) {
      return startDate ? startDate.calendar(moment()).replace('Tomorrow', 'tomorrow').replace('Today', 'today').replace('PM', 'p.m.').replace('AM', 'a.m.').replace(' at', ' at <strong><span class="text-primary">' + '<TimerIcon></TimerIcon>') : ''
    },
    thumbnail: function (url) {
      return url.replace('image/upload/', 'image/upload/c_scale,w_348/')
    }
  },
  computed: {
    recipes: function () {
      return this.$store.state.recipes
    }
  },
  methods: {
    cardClasses: function (index) {
      var ret = 'mb-4'
      if (index === 0) ret += ' d-block d-sm-none'
      return ret
    },
    noWidows: function (text) {
      var elArr = text.split(' ')
      if (elArr.length <= 2) return text
      // Remove last two words from array and join them together with non-breaking space
      var lastWords = elArr.splice(-2, 2).join('&nbsp')

      // Add last two words back to headline array
      elArr.push(lastWords)

      // Change html for headline. The last two words will not break now, resulting in no widows!
      return elArr.join(' ')
    },
    image: function (recipe) {
      return recipe.images ? recipe.images[0] ? recipe.images[0].secure_url : 'static/bread2.jpg' : 'static/bread2.jpg'
    },
    startTime: function (step) {
      // var totalMaxTime = step
    },
    timeUntilDone: function (recipe) {
      var myicon = instance.$mount()
      var myiconhtml = myicon.$el.innerHTML.replace(/24/, '17')
      // console.log(myiconhtml)
      var text = moment().add(recipe.totalRecipeLength, 'm').calendar(moment()).replace('Tomorrow', 'tomorrow').replace('Today', 'today').replace(' PM', '&nbsp;p.m.').replace(' AM', '&nbsp;a.m.').replace(' at', ' at <strong><span class="text-primary">' + myiconhtml)
      return text
    },
    endTime: function (recipe) {
      var myicon = instance.$mount()
      // .replace(/.$/, '')
      var myiconhtml = myicon.$el.innerHTML.replace(/24/, '17')
      var idealStartTime = recipe.recommendedTimes && recipe.recommendedTimes[0] ? recipe.recommendedTimes[0].startTime : 0
      var ret = moment().startOf('day').add(idealStartTime, 'h').add(recipe.totalRecipeLength, 'm').calendar(moment()).replace('Tomorrow', 'tomorrow').replace('Today at', '').replace('PM', 'p.m.').replace('AM', 'a.m.').replace(' at', ' at <strong><span class="text-primary">' + myiconhtml + '</span></strong>')
      return ret.match('at') === null ? 'at ' + ret : ret
      // return startDate ? moment(startDate).add(this.$store.state.recipe.totalRecipeLength, 'm').calendar(moment(startDate)).replace(/.$/, '').replace('Tomorrow', 'tomorrow').replace('Today', 'today').replace('PM', 'p.m.').replace('AM', 'a.m.') : ''
    },
    openRecipe: function (recipe) {
      // this.$router.push('recipe/' + recipe._id + '/edit')
      if (!recipe) recipe = {_id: recipe._id}
      if (recipe._id !== '') {
        // window.location.hash = `${record._id}/edit`
        // this.$router.push({ path: `${recipe._id}/edit` })
        this.$store.dispatch('getRecipe', recipe)
      }
      this.$router.push('recipe/' + recipe._id)
    }
  }
}
</script>
