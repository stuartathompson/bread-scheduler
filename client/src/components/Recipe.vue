<template>
  <div class="recipe mt-2">
    <b-container fluid>
      <b-row class="pb-5">
        <b-col xs=12>
            <div class="cover" :style="image">&nbsp;</div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h1 class="">{{ recipe.title }}</h1>
        </b-col>
      </b-row>
      <b-row class="">
        <b-col class="">
          <div class="pt-3 mt-2 pb-3 mb-2 border border-left-0 border-right-0">
            <div class="d-inline d-sm-inline mr-4"><span class="text-primary mr-1">Total Time</span> {{ recipe.totalRecipeLength | hours }}</div>
            <div class="d-inline d-sm-inline mr-4"><span class="text-primary mr-1">Ideal Start Time</span> {{ recipe.recommendedTimes && recipe.recommendedTimes[0] ? recipe.recommendedTimes[0].startTime : 'N/A' | hoursToTime }}</div>

            <div v-if="isBread" class="d-inline d-sm-inline mr-4"><span class="text-primary mr-1">Makes</span> {{ loaves(recipe.numberOfLoaves) }}</div>
            <div class="d-block d-sm-inline mt-1 mr-4"><span class="text-primary mr-1">Rating</span>
              <span v-for="i in starLength" @click="setStarRating(i)" @mouseover="starHover(i)" @mouseout="starHover(i, 'out')" :class="(!starActive && starSel === -1 && userRating >= i) || (!starActive && starFix >= i) || (starActive && starSel >= i)? 'cursor text-primary' : 'cursor text-dark'">
                <star-icon></star-icon>
              </span>
            </div>
            <b-link v-if="auth" :href="editUrl" variant="primary" class="ml-4 float-right text-secondary">Edit</b-link>
            <!-- <b-link variant="primary" class="float-right text-primary"><plus-icon></plus-icon>Save to my recipes</b-link> -->
          </div>
        </b-col>
      </b-row>
      <!-- <b-row class="mb-5">
        <b-col>
        </b-col>
      </b-row> -->
      <b-row class="mt-3">
        <b-col md="3">
          <!-- <h3>Start now and finish {{ timeFromNow }}</h3> -->
          <p class="pb-4 text-large">
            {{ recipe.description }}
          </p>
          <div class="pb-1">
            <strong>What you’ll need</strong>
          </div>
          <div class="pb-1 text-medium">
            <b-form-radio-group class="ml-auto inline-radio text-thin text-sans-serif text-medium" v-model="preferences.measurement">
              <b-radio value="grams">Grams</b-radio>
              <b-radio value="ounces">Ounces</b-radio>
              <!-- <b-radio value="volume">Volume</b-radio> -->
            </b-form-radio-group>
            <b-checkbox class="mb-1 mt-1" v-model="preferences.half">Half this recipe</b-checkbox>
          </div>
          <template v-if="recipe && recipe.ingredients && recipe.ingredients.length > 0" v-for="ingredient of recipe.ingredients">
            <span  class="text-medium text-bold" v-if="recipe.ingredients && recipe.ingredients.length > 1">{{ ingredient.item }}</span>
            <b-table small thead-class="d-none" :items="ingredient.ingredients" :fields="ingredientTableFields" class="table-no-top-rule">
              <template slot="amount" slot-scope="data">
                <s class="text-lighter" v-if="preferences.half">{{ convertMeasurement(data.item) }}</s>
                <template v-else>{{ convertMeasurement(data.item) }}</template>
              </template>
              <template v-if="preferences.half" slot="halved" slot-scope="data">
                {{ half(data.item) }}
              </template>
              <template slot="percentages" slot-scope="data">
                {{ getPercentages(ingredient, data.item) }}
              </template>
            </b-table>
          </template>


          <!-- <div class="pt-4 pb-1">
            <strong>Your baking schedule</strong>
          </div>
            <b-table small thead-class="d-none" :items="recipe.steps" :fields="stepTimelineFields" class="table-no-top-rule">
              <template slot="startTime" slot-scope="data">
                {{ data.item.startTime | time }}
              </template>
            </b-table> -->

        </b-col>
        <!-- <b-col md="3">
          <div class="pb-4">
            <strong>Measurements</strong><br />
          </div>
        </b-col> -->
        <b-col xs=12 md=8 class="pt-4 pt-sm-0 ml-auto">
          <h4>Plan Your Bake</h4>
          <b-card no-body>
            <!-- <b-row class="pl-4 pr-4 pb-0 pt-4">
              <b-col>
                <b-row>
                  <b-col class="pb-0">
                    Start time: <span v-html="calendar(startDate)" class="text-primary"></span>
                  </b-col>
                </b-row>
              </b-col>
            </b-row> -->
            <div class="">
              <!-- border border-right-0 border-left-0 border-bottom-0 -->
              <b-row class="pl-4 pr-4 pb-3 pt-4">
                <b-col>
                  <b-row>
                    <b-col class="pb-2 recipe-dropdown-wrapper">
                      <!-- <b-link @click="autoFit()">autofit</b-link> -->
                        I want to
                        <b-dropdown size="sm" :text="selectedStartEnd">
                          <b-dropdown-item class="text-medium" @click="toggleButton('start')" size="sm">start</b-dropdown-item>
                          <b-dropdown-item class="text-medium" @click="toggleButton('finish')" size="sm">finish</b-dropdown-item>
                        </b-dropdown>
                        <b-col class="d-sm-none"></b-col>
                        this recipe
                        <b-dropdown size="sm" :text="selectedTime">
                          <b-dropdown-item class="text-medium" @click="toggleButton('ideal')" size="sm">at the ideal time</b-dropdown-item>
                          <b-dropdown-item v-if="selectedStartEnd === 'start'" class="text-medium" @click="toggleButton('now')" size="sm">right now</b-dropdown-item>
                          <b-dropdown-item v-if="enoughTime('tonight')" class="text-medium" @click="toggleButton('tonight')" size="sm">tonight</b-dropdown-item>
                          <b-dropdown-item v-if="enoughTime('tomorrow_morning')" class="text-medium" @click="toggleButton('tomorrow_morning')" size="sm">tomorrow morning</b-dropdown-item>
                          <b-dropdown-item v-if="enoughTime('tomorrow_night')" class="text-medium" @click="toggleButton('tomorrow_night')" size="sm">tomorrow night</b-dropdown-item>
                          <!-- <b-dropdown-item class="text-medium" @click="toggleButton('tomorrow_night')" size="sm">pick a time</b-dropdown-item> -->
                        </b-dropdown>
                        <!-- <b-btn @click="autoFit()" variant="primary" size="sm">Autofit</b-btn> -->

                        <!-- <b-btn-group>
                          <b-btn size="sm" @click="toggleButton('bake_now')" :variant="buttonSelected === 'bake_now' ? 'primary' : 'secondary'">Now</b-btn>
                          <b-btn size="sm" @click="toggleButton('bake_tonight')" :variant="buttonSelected === 'bake_tonight' ? 'primary' : 'secondary'">Tonight</b-btn>
                          <b-btn size="sm" @click="toggleButton('bake_tomorrow_morning')" :variant="buttonSelected === 'bake_tomorrow_morning' ? 'primary' : 'secondary'">Tomorrow</b-btn>
                          <b-btn size="sm" @click="toggleButton('bake_tomorrow_night')" :variant="buttonSelected === 'bake_tomorrow_night' ? 'primary' : 'secondary'">Tomorrow night</b-btn>
                        </b-btn-group> -->
                        <b-input v-show="selectedTime === 'bake_custom'" placeholder="Choose a time"></b-input>
                    </b-col>
                    <b-col md="12" lg="4" class="text-left text-lg-right mt-2">
                      <b-btn size="sm" variant="link" @click="showScheduler()" :class="view === 'scheduler' ? 'text-primary pl-0' : 'text-dark pl-0'"><chart-timeline-icon></chart-timeline-icon> Scheduler</b-btn>
                      <b-btn size="sm" variant="link" @click="view = 'agenda'" :class="view === 'agenda' ? 'text-primary' : 'text-dark'"><table-icon></table-icon> Agenda</b-btn>
                    </b-col>
                  </b-row>
                  <!-- <b-row>
                    <b-col md="12">
                      <div class="legend-item">
                        <div class="legend-label">
                          <strong>Legend</strong>
                        </div>
                      </div>
                      <div class="legend-item">
                        <div class="legend-box" style="background-color:#ff3300"></div>
                        <div class="legend-label">
                          Hands-on
                        </div>
                      </div>
                      <div class="legend-item">
                        <div class="legend-box" style="background-color:#71757A"></div>
                        <div class="legend-label">
                          Let it rest
                        </div>
                      </div>
                    </b-col>
                  </b-row> -->
                </b-col>
                <!-- <b-col>
                  <b-row>
                    <b-col class="pb-2"><strong>I want to eat</strong></b-col>
                  </b-row>
                  <b-btn size="sm" @click="toggleButton('eat_tonight')" :variant="buttonSelected === 'eat_tonight' ? 'primary' : 'secondary'">Tonight</b-btn>
                  <b-btn size="sm" @click="toggleButton('eat_tomorrow_morning')" :variant="buttonSelected === 'eat_tomorrow_morning' ? 'primary' : 'secondary'">Tomorrow</b-btn>
                  <b-btn size="sm" @click="toggleButton('eat_tomorrow_night')" :variant="buttonSelected === 'eat_tomorrow_night' ? 'primary' : 'secondary'">Tomorrow night</b-btn>
                </b-col> -->
              </b-row>
              <b-btn v-show="view === 'scheduler'" @click="resetViz" size="sm" class="d-absolute reset-button"  variant="light">Reset</b-btn>
              <div v-show="view === 'scheduler'" id="scheduler" class="pt-2 cursor-grab no-select viz">&nbsp;</div>
              <b-col v-if="view === 'agenda'">
                <b-table thead-class="d-none" :items="recipe.steps" :fields="agendaFields" class="w-100 table-no-top-rule">
                  <template slot="category" slot-scope="data">
                    {{ data.item.category }}
                  </template>
                  <template slot="day" slot-scope="data">
                    {{ day(data.item) }}
                  </template>
                  <template slot="startTime" slot-scope="data">
                    {{ data.item.startTime | time }}
                  </template>
                </b-table>
              </b-col>
              <!-- <b-row class="pl-4 pr-4 pb-4">
                <b-col>
                  <b-checkbox size="sm" class="text-small ml-2" v-model="autosave" :checked="autosave">Saving your changes</b-checkbox>
                </b-col>
              </b-row> -->
            </div>

             <!-- v-if="recipe && recipe.steps.length > 0" -->
          </b-card>

          <h4 class="mt-5 pb-1">Step-by-Step Instructions
          </h4>
          <b-card no-body>
            <b-card-body v-for="step of recipe.steps" class="border mb-4 border-left-0 border-right-0 border-top-0 ">
              <b-row>
                <b-col>
                  <h6 v-if="step.category"><span class="text-primary">{{ step.startTime | time }}</span><br /> {{ step.category }}</h6>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="pb-3">
                  <p>
                    {{ step.step }}
                  </p>
                  <div class="text-medium pb-2 text-lighter" v-if="step.ingredients && step.ingredients.length > 0">
                    For this step:
                  </div>
                  <b-table thead-class="d-none" small v-if="step.ingredients && step.ingredients.length > 0" :fields="ingredientTableFields" :items="step.ingredients" class="ingredients-table">
                    <template slot="amount" slot-scope="data">
                      {{ convertMeasurement(data.item) }}
                    </template>

                    <template v-if="preferences.half" slot="halved" slot-scope="data">
                      {{ half(data.item) }}
                    </template>
                    <template slot="amount"slot-scope="data">
                      <s class="text-lighter" v-if="preferences.half">{{ convertMeasurement(data.item) }}</s>
                      <template v-else>{{ convertMeasurement(data.item) }}</template>
                    </template>
                  </b-table>
                  <b-btn v-if="step.timeBreak[0]" @click="startTimer(step)" size="sm" :variant="timerActive === step && !noTimer ? 'primary' : 'secondary'">
                    <timer-icon></timer-icon> Start {{ timeToNextStep(step) | hoursSingle }} timer
                  </b-btn>
                </b-col>
                <b-col md="6" v-if="stepImage(step) != ''" v-html="stepImage(step)"></b-col>
              </b-row>
            </b-card-body>
            <b-card-body v-if="isBread" class="border mb-4 border-left-0 border-right-0 border-top-0 ">
              <b-row>
                <b-col>
                  <h6><span class="text-primary">
                    {{ processEndDate(endDate) | time}}</span><br />
                    Cut and enjoy
                  </h6>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <p>
                    You should wait at least two hours before cutting into your loaf.
                  </p>
                </b-col>
                <b-col md="6">
                  <img class="w-100" src="static/cutting.jpg" />
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <!-- <b-row>
        <b-col v-if="recipes" v-for="(recipe, index) of recipes" class="mb-4" sm="6" md="4">
          <b-card
          @click="openRecipe(recipe)"
          :title="recipe.title"
          :img-src="recipe.images[0].secure_url | thumbnail"
          class="recipes-card cursor">
            <p class="mb-2 md-3 card-text">
              {{ recipe.shortDescription }}
            </p>
            <p class="pt-1 mb-0 text-medium">
              Finish <span v-html="timeUntilDone(recipe)"></span>
            </p>
        </b-card>
        </b-col>

      </b-row> -->
    </b-container>
  </div>
</template>

<script>
// import RecordsService from '@/services/RecordsService'
import Viz from '@/components/Viz'
import Viz2 from '@/components/Viz2'
import moment from 'moment'
const d3 = require('d3')
export default {
  name: 'Recipe',
  data () {
    return {
      value: 10,
      max: 48,
      componentKey: 0,
      tooltip: false,
      autosave: true,
      view: 'scheduler',
      selectedTime: 'at the ideal time',
      vizType: 'row',
      selectedStartEnd: 'start',
      updateChart: null,
      dateDefaults: {
        'start_ideal': this.$store.state.recipe.recommendedTimes && this.$store.state.recipe.recommendedTimes[0] ? moment().startOf('day').add(this.$store.state.recipe.recommendedTimes[0].startTime, 'h').diff(moment(), 'm') < 0 ? moment().startOf('day').add(1, 'd').add(this.$store.state.recipe.recommendedTimes[0].startTime, 'h') : moment().startOf('day').add(this.$store.state.recipe.recommendedTimes[0].startTime, 'h') : moment(),
        'start_now': moment(),
        'start_tonight': moment().startOf('day').add(19, 'h'),
        'start_tomorrow_morning': moment().add(1, 'd').startOf('day').add(9, 'h'),
        'start_tomorrow_night': moment().add(1, 'd').startOf('day').add(19, 'h'),
        'finish_ideal': this.$store.state.recipe.recommendedTimes && this.$store.state.recipe.recommendedTimes[0] ? moment().startOf('day').add(this.$store.state.recipe.recommendedTimes[0].startTime, 'h').diff(moment(), 'm') < 0 ? moment().startOf('day').add(1, 'd').add(this.$store.state.recipe.recommendedTimes[0].startTime, 'h') : moment().startOf('day').add(this.$store.state.recipe.recommendedTimes[0].startTime, 'h') : moment(),
        'finish_now': moment().subtract(this.$store.state.recipe.totalRecipeLength, 'm'),
        'finish_tonight': moment().startOf('day').add(19, 'h').subtract(this.$store.state.recipe.totalRecipeLength, 'm'),
        'finish_tomorrow_morning': moment().add(1, 'd').startOf('day').add(9, 'h').subtract(this.$store.state.recipe.totalRecipeLength, 'm'),
        'finish_tomorrow_night': moment().add(1, 'd').startOf('day').add(19, 'h').subtract(this.$store.state.recipe.totalRecipeLength, 'm')
      },
      dateLabels: {
        'ideal': 'at the ideal time',
        'now': 'right now',
        'tonight': 'tonight',
        'tomorrow_morning': 'tomorrow morning',
        'tomorrow_night': 'tomorrow night'
      },
      skedStartDate: null,
      skedStartDateTarget: null,
      buttonSelected: 'now',
      days: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
      timeOption: 'hours',
      sliderHours: 0,
      // originalRecipe: Object.assign({}, this.$store.state.recipe),
      originalstartDate: this.$store.state.startDate,
      data: [],
      starActive: false,
      starSel: -1,
      starFix: -1,
      starLength: [0, 1, 2, 3, 4],
      preferences: {
        measurement: 'grams',
        half: false
      },
      recipe_id: null,
      timerActive: null,
      ingredientTableFields: [
        {
          key: 'amount'
        },
        {
          key: 'halved'
        },
        {
          key: 'ingredient'
        },
        {
          key: 'percentages',
          'class': 'text-lighter text-right'
        }
      ],
      agendaFields: [
        {
          key: 'day',
          class: 'text-strong text-primary'
        },
        {
          key: 'startTime',
          class: 'text-nowrap'
        },
        {
          key: 'category',
          class: 'text-nowrap w-100'
        }
      ],
      stepTimelineFields: [
        {
          key: 'category',
          class: 'text-nowrap'
        },
        {
          key: 'startTime',
          class: 'text-lighter text-right text-nowrap'
        },
        {
          key: 'day',
          class: 'text-strong text-primary'
        }
        // {
        //   key: 'startTime',
        //   class: 'text-nowrap'
        // },
        // // {
        // //   key: 'to',
        // //   class: 'pl-0 pr-0'
        // // },
        // // {
        // //   key: 'endTime',
        // //   class: 'text-nowrap'
        // // },
        // {
        //   key: 'category',
        //   class: 'text-nowrap w-100'
        // }
      ],
      stepsTableFields: [
        {
          category: 'Steps'
        }
      ],
      renderComponent: true
    }
  },
  components: {
    Viz,
    Viz2
  },
  created () {
    // console.log('created recipe')
  },
  beforeMount () {
  },
  mounted () {
    // console.log('mounted recipe')
    this.getRecipe().then(this.makeViz)
  },
  updated () {
    // console.log('updated recipe')
    // this.makeViz()
  },
  filters: {
    time: function (time) {
      return moment(time).format('h:mm a')
    },
    hours: function (value) {
      return value >= 60 ? Math.round(value / 60) + ' hours' : value + ' minutes'
    },
    hoursToTime: function (hours) {
      return isNaN(hours) ? hours : moment().startOf('day').add(hours, 'h').format('h A').replace('AM', 'a.m.').replace('PM', 'p.m.')
    },
    hoursSingle: function (value) {
      return value >= 60 ? Math.round(value / 60) + ' hour' : value + ' minute'
    }
  },
  computed: {
    isBread: function () {
      return this.$store.state.recipe.ingredients.filter(d => {
        return d.item.match(/bread/gi)
      }).length > 0
    },
    userRating: function () {
      var recipe = JSON.parse(window.localStorage.getItem(this.recipe._id))
      return recipe === null ? '-1' : recipe.userRating
    },
    timeFromNow: function () {
      return this.$store.state.recipe.totalRecipeLength ? moment().add(this.$store.state.recipe.totalRecipeLength, 'm').calendar(moment()).replace('Tomorrow', 'tomorrow').replace('Today', 'today').replace('PM', 'p.m.').replace('AM', 'a.m.') : ' soon'
    },
    auth: function () {
      return this.$store.state.authStatus
    },
    startDate: function () {
      return this.$store.state.startDate
    },
    endDate: function () {
      return this.$store.state.endDate
    },
    startTime: function () {
      return moment().add(this.$store.state.addHours, 'h')
    },
    recipe: function () {
      return this.$store.state.recipe
    },
    finishTimeMax: function () {
      return this.$store.state.timer.finishTimeMax
    },
    editUrl: function () {
      return '#/recipe/' + this.recipe_id + '/edit'
    },
    noTimer: function () {
      return !this.$store.state.timer.t
    },
    image: function () {
      return this.$store.state.recipe.images ? this.$store.state.recipe.images[0] ? `background-image:url('${this.$store.state.recipe.images[0].secure_url}')` : `background-image:url('static/bread2.jpg')` : `background-image:url('static/bread2.jpg')`
    }
    // recipes: function () {
    //   // if (this.$store.state.recipes === null) this.$store.dispatch('getRecipes')
    //   return this.$store.state.recipes
    // }
  },
  methods: {
    day: function (step) {
      var showDate = true
      var i = 0
      var that = this
      for (var thisStep of this.recipe.steps) {
        if (thisStep === step) {
          // This is the step, so is the start time different than the last?
          showDate = i === 0 || (that.recipe.steps[i - 1] && moment(that.recipe.steps[i - 1].startTime).format('dddd') !== moment(step.startTime).format('dddd'))
        }
        i++
      }
      return showDate ? moment(step.startTime).format('dddd') : ''
    },
    getIdealStepTime: function (timeBreakStep) {
      // Gets the ideal amount of time in each step by adding up ideal OR min time breaks
      // This is used to adjust following step start times by the amount of time
      // taken by the previous step
      var ret = 0
      for (var step of timeBreakStep) {
        ret += step.timeIdeal ? Number(step.timeIdeal) : Number(step.timeMin)
      }
      return ret
    },
    makeViz: function () {
      var that = this
      var data = this.$store.state.recipe.steps

      // Default to the ideal start time
      this.skedStartDate = this.dateDefaults['start_ideal']
      console.log('diff', moment().startOf('day').add(this.$store.state.recipe.recommendedTimes[0].startTime, 'h').diff(moment(), 'm'), this.skedStartDate)
      // Clear content
      document.getElementById('scheduler').innerHTML = ''

      const numberOfSteps = data.length
      const margin = 50
      const barHeight = 10
      const barMargin = 30
      const height = (barHeight * numberOfSteps) + (barMargin * numberOfSteps) + 60

      var width = document.getElementById('scheduler').offsetWidth
      const primary = '#6F757B'
      const hover = '#4e4c4c'
      const color = primary // '#ff3300'
      const secondary = '#bababa'

      // Make SVG
      const svgW = d3.select('#scheduler')
        .append('svg')
        .attr('width', width)
        .attr('height', height + margin)

      // console.log('sled start date', this.skedStartDate)

      let minSkedDate
      let maxSkedDate

      var processData = (reset) => {
        // Sets the start time of the viz, which affects all future start times as part of the following data loop
        minSkedDate = this.skedStartDate ? moment(this.skedStartDate) : moment(data[0].startTime)
        maxSkedDate = moment(minSkedDate)

        // console.log('minmax', minSkedDate, maxSkedDate)

        // Add previous minMax times together based on datum.startTime or minSkedDate
        var i = 0
        for (var datum of data) {
          // First step, so no previous steps on which to affect this start time
          if (i === 0) {
            datum.startTime = datum.startTime ? moment(datum.startTime) : moment(minSkedDate)
            // datum.additiveTimeMin = datum.additiveTimeMin && !reset ? moment(datum.additiveTimeMin) : minSkedDate.clone().add(datum.timeBreak[0].timeMin, 'm')
            // datum.additiveTimeMax = datum.additiveTimeMax && !reset ? moment(datum.additiveTimeMax) : minSkedDate.clone().add(datum.timeBreak[0].timeMax, 'm')
          } else {
            datum.startTime = datum.startTime ? moment(datum.startTime) : moment(data[i - 1].startTime).add(this.getIdealStepTime(data[i - 1].timeBreak), 'm')
            // datum.additiveTimeMin = datum.additiveTimeMin && !reset ? moment(datum.additiveTimeMin) : data[i - 1].additiveTimeMin.clone().add(datum.timeBreak[0].timeMin, 'm')
            // datum.additiveTimeMax = datum.additiveTimeMax && !reset ? moment(datum.additiveTimeMax) : data[i - 1].additiveTimeMax.clone().add(datum.timeBreak[0].timeMax, 'm')
            maxSkedDate = moment(datum.startTime).add(this.getIdealStepTime(datum.timeBreak), 'm')
            // console.log(maxSkedDate)
            // maxSkedDate.diff(moment(datum.additiveTimeMin), 'm') > 0 ? moment(datum.additiveTime) : maxSkedDate
          }
          i++
        }
        // this.recipe.steps = data
      }

      processData()

      this.processData = () => processData()

      // console.log(data)

      // Padding
      // minSkedDate.subtract(1, 'h')
      // maxSkedDate.add(1.5, 'h')

      const x = d3.scaleTime().domain([minSkedDate, maxSkedDate]).range([0, width])
      const xHour = d3.scaleTime().domain([0, maxSkedDate.diff(minSkedDate, 'm')]).range([0, width])
      const y = d3.scaleLinear().domain([0, data.length]).range([15, height - 15])

      const svg = svgW.append('g')
        .attr('transform', `translate(${0}, ${margin})`)

      const topBarFill = '#eee'
      // const topBarFillHover = '#f6f6f6'

      // Top bar background
      svg.append('rect')
        .attr('width', width + margin)
        .attr('height', margin - 5)
        .attr('fill', topBarFill)
        .attr('class', 'top-bar-fill')
        .attr('opacity', 1)
        .attr('x', -margin / 2)
        .attr('y', -margin)

      // Background blocks for date coloring (sunday, monday, etc.)
      // var minBlock = svg.append('rect')
      //   .attr('fill', 'green')
      //   .attr('height', height + 10)
      //   .attr('y', -5)
      // var maxBlock = svg.append('rect')
      //   .attr('fill', 'red')
      //   .attr('height', height + 10)
      //   .attr('y', -5)

      // Axis for each day's tick and label
      var xAxisDays = svg.append('g')
        .attr('transform', 'translate(0,' + -25 + ')')
        .style('font-weight', 600)

      // Axis for regular time
      var xAxis = svg.append('g')
        .attr('transform', 'translate(0,' + -10 + ')')

      // Axis for each hour tick
      var xAxisHour = svg.append('g')
        .attr('opacity', 0.5)
        .attr('transform', 'translate(0,' + -10 + ')')

      // vertical bar for current time
      var currentTime = svg.append('g')
        .attr('transform', `translate(${x(moment())},-5)`)

      // currentTimeBar
      currentTime.append('rect')
        .attr('height', height + 15)
        .attr('width', 1)
        .attr('fill', color)
        .attr('y', -5)

      // currentTimeCircle
      currentTime.append('circle')
        .attr('r', 5)
        .attr('cx', 0)
        .attr('fill', color)

      // Stick date bg
      svg.append('rect')
        .attr('class', 'top-bar-fill')
        .attr('fill', topBarFill)
        .attr('width', 60)
        .attr('height', 15)
        .attr('y', -40)
        .attr('x', 0)

      // Sticky date text
      var stickyDate = svg.append('text')
        .text('Saturday')
        .attr('class', 'label-weekday')
        .style('font-weight', 600)
        .style('font-size', '11px')
        .style('fill', '#212529')
        .attr('x', 10)
        .attr('y', -30)
      /* -
      /* - Dragging the top bar
      /* -   - */
      var dragging = false
      svg.append('rect')
        .attr('width', width + margin)
        .attr('height', margin - 10)
        .attr('fill', 'red')
        .attr('opacity', 0)
        .attr('x', -margin / 2)
        .attr('y', -margin)
        .call(d3.drag()
          .on('start', dragVizTimeStarted)
          .on('drag', draggedVizTime)
          .on('end', dragVizTimeEnded))
        // .on('mouseover', () => {
        //   svg.selectAll('.top-bar-fill').attr('fill', topBarFillHover)
        // })
        // .on('mouseout', () => {
        //   if (!draggingTopBar) svg.selectAll('.top-bar-fill').attr('fill', topBarFill)
        // })
        // .call(d3.drag()
        //   .on('start', dragVizStarted)
        //   .on('drag', draggedViz)
        //   .on('end', dragVizEnded))

      // var startXTime = 0
      // var draggingTopBar
      // function dragVizStarted (d, i) {
      //   draggingTopBar = true
      //   // Color the top bar
      //   startXTime = x.invert(d3.event.x)
      // }
      // function draggedViz (d, i) {
      //   // Get difference between start and current pos in hours
      //   var diff = moment(startXTime).diff(moment(x.invert(d3.event.x)), 'm')
      //   minSkedDate = startDateSked.add(diff, 'm')
      //   maxSkedDate = endDateSked.add(diff, 'm')
      //   steps
      //     .each((step) => {
      //       step.startTime.add(diff, 'm')
      //     })
      //   // x.domain([minSkedDate, maxSkedDate])
      //   updateChart(false, true)
      // }
      //
      // function dragVizEnded () {
      //   draggingTopBar = false
      // }

      /* -
      /* - Dragging the main bar area
      /* -   - */
      svg.append('rect')
        .attr('width', width + margin)
        .attr('height', height + 15)
        .attr('opacity', 0)
        .attr('x', -margin / 2)
        .attr('y', -10)
        .call(d3.drag()
          .on('start', dragVizTimeStarted)
          .on('drag', draggedVizTime)
          .on('end', dragVizTimeEnded))

      var startX = 0
      var startDateSked = minSkedDate
      var endDateSked = maxSkedDate
      function dragVizTimeStarted (d, i) {
        startX = x.invert(d3.event.x)
        startDateSked = minSkedDate
        endDateSked = maxSkedDate
      }
      function draggedVizTime (d, i) {
        // Get difference between start and current pos in hours
        var diff = moment(startX).diff(moment(x.invert(d3.event.x)), 'm')
        minSkedDate = startDateSked.add(diff, 'm')
        maxSkedDate = endDateSked.add(diff, 'm')
        // x.domain([minSkedDate, maxSkedDate])
        updateChart(false, true)
      }

      function dragVizTimeEnded () {
      }

      /* -
      /* - Dragging the step bars themselves
      /* -   - */
      const stepWrap = svg.selectAll('g.step-wrap')
        .data(data).enter()
      .append('g')
          .attr('class', 'step-wrap')

      const steps = stepWrap.append('g')
        .attr('class', 'step')
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', function (d, i) { dragended(d, i) }))

      const stepsGroup = steps.append('g')

      // Hashing
      svg
        .append('defs')
        .append('pattern')
          .attr('id', 'diagonalHatch')
          .attr('patternUnits', 'userSpaceOnUse')
          .attr('width', 4)
          .attr('height', 4)
        .append('path')
          .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
          .attr('stroke', '#333')
          .attr('stroke-width', 1)

      // console.clear()
      // Add each timebreak from this step in a horizontal fashion
      var googleSteps = stepsGroup.selectAll('.time-break-steps')
        .data(d => d.timeBreak).enter()
          .append('g')
            .attr('transform', function (d, i) {
              var lastStepTimeMax = i === 0 ? 0 : d3.select(this.parentNode).data()[0].timeBreak[i - 1].timeIdeal || d3.select(this.parentNode).data()[0].timeBreak[i - 1].timeMin
              return `translate(${xHour(lastStepTimeMax)}, ${y(0)})`
            })
      var googleStepsMin = googleSteps
          .append('rect')
            .attr('stroke', 'white')
            .attr('width', d => xHour(d.timeMin))
            .attr('fill', d => d.activePassive === 'active' ? color : primary)
            .attr('height', barHeight)
      var googleStepsMax = googleSteps
          .append('rect')
            .attr('stroke', 'white')
            .attr('opacity', 0.5)
            .attr('width', d => xHour(d.timeMax))
            .attr('fill', d => d.activePassive === 'active' ? color : primary)
            .attr('height', barHeight)

      stepsGroup
        .on('mouseover', function (d, i) {
          d3.selectAll('rect.step-min-rect').filter((k, j) => {
            return j >= i
          })
            .attr('fill', hover)
          // d3.select(this).selectAll('text').text((d, i) => {
          //   return d.category + ' at ' + that.$options.filters.time(d.startTime)
          // })
        })
        .on('mousedown', function (d, i) {
          d3.selectAll('rect.step-min-rect').filter((k, j) => {
            return j >= i
          })
            .attr('fill', hover)
          stepsGroup.filter((k, j) => {
            return j >= i
          })
            .attr('transform', 'translate(0, -2.5)')
        })
        .on('mouseup', function (d, i) {
          // console.log('mouseup')
          stepsGroup.filter((k, j) => {
            return j >= i
          })
            .attr('transform', 'translate(0, -5)')
        })
        .on('mouseout', function (d, j) {
          // console.log('ok')
          if (!dragging) {
            d3.selectAll('rect.step-min-rect')
              .attr('fill', primary)
          }
          // d3.select(this).selectAll('text').text((d) => {
          //   return d.category + (j === 0 || j === data.length - 1 ? ' at ' + that.$options.filters.time(d.startTime) : '')
          // })
        })

      var stepStartX = null
      function dragstarted (step, i) {
        dragging = true
        stepStartX = x.invert(d3.event.x)
      }
      function dragged (step, i) {
        // get change in minutes
        var diff = moment(x.invert(d3.event.x)).diff(moment(stepStartX), 's')
        stepStartX = x.invert(d3.event.x)

        // Move previous items
        steps.filter((d, j) => j < i)
          .each((d, j) => {
            var targetStartTime = step.startTime.clone().add(diff, 's')
            var thisStartTime = d.startTime.clone().add(diff, 's')
            // If we've moved less than the start of the previous one, so we need to move it to align
            if (targetStartTime < thisStartTime) {
              d.startTime = targetStartTime
            }
          })

        // Move following in sync
        steps.filter((d, j) => j > i)
          .each(d => {
            d.startTime.add(diff, 's')
          })
        // Modify this step's start date by this amount
        step.startTime.add(diff, 's')
        updateChart(false, true)
      }
      function dragended (step, i) {
        dragging = false
        stepsGroup.filter((k, j) => {
          return j >= i
        })
          .attr('transform', 'translate(0, 0)')
        svg.selectAll('rect.step-min-rect')
          .attr('fill', primary)
        refitChart()
      }

      // Max Bar and circle
      var maxRect = stepsGroup.append('rect')
        .attr('class', 'step-rect step-max-rect')
        .attr('height', barHeight)
        .attr('fill', secondary)
        .attr('opacity', 0)

      // Min bar and circles
      var minRect = stepsGroup.append('rect')
        .attr('class', 'step-rect step-min-rect')
        .attr('height', barHeight)
        .attr('fill', primary)
        .attr('opacity', 0)

      var stepText = stepsGroup.append('text')
        .attr('y', barHeight / 1.25)
        .style('fill', '#8c8989')
        .style('font-family', 'sans-serif')
        .style('font-size', 14)

      function refitChart () {
        that.skedStartDate = null
        processData(false)
        updateChart(true)
      }
      function updateChart (animate, noPad) {
        width = document.getElementById('scheduler').offsetWidth
        svgW
          .attr('width', width)
        // Add scale paddingi
        if (!noPad) {
          // console.log(noPad)
          minSkedDate.subtract(1, 'h')
          maxSkedDate.add(3, 'h')
        }
        // Reset scales
        x.domain([minSkedDate, maxSkedDate]).range([0, width])
        xHour.domain([0, maxSkedDate.diff(minSkedDate, 'm')]).range([0, width])
        y.domain([0, data.length]).range([15, height - 15])

        xAxis.transition().duration(animate ? 1000 : 0).call(d3.axisTop(x).ticks(10).tickFormat(d3.timeFormat('%-I %p')))
        xAxisHour.transition().duration(animate ? 1000 : 0).call(d3.axisTop(x).ticks(d3.timeHour.every(1)).tickFormat(''))
        xAxisDays.transition().duration(animate ? 1000 : 0).call(d3.axisTop(x).ticks(d3.timeDay.every(1)).tickFormat(d3.timeFormat('%A')))

        xAxisDays.selectAll('line').transition().duration(animate ? 1000 : 0)
          .attr('y1', 20)
          .attr('y2', height + 30)
          .attr('stroke-width', 2)
          .attr('opacity', 0.12)

        xAxisDays.selectAll('text').transition().duration(animate ? 1000 : 0)
          .attr('opacity', d => {
            return x(d) < 30 ? 0 : 1
          })

        xAxis.selectAll('.tick line').remove()
        xAxisHour.selectAll('.tick line').transition().duration(animate ? 1000 : 0)
          .attr('y1', 5)
          .attr('y2', height + 15)
          .attr('opacity', 0.15)

        svg.selectAll('.tick text').transition().duration(animate ? 1000 : 0)
          .attr('y', -5)

        // minBlock.transition().duration(animate ? 1000 : 0).attr('x', x(moment(minSkedDate).subtract(1, 'h').startOf('day')))
        //   .attr('width', xHour(60 * 24))
        //   .attr('fill', d => {
        //     var val = parseInt(moment(minSkedDate).subtract(1, 'h').add(1, 'h').format('d'))
        //     if (val === 0 || val === 2 || val === 4 || val === 6) {
        //       return '#fff'
        //     } else {
        //       return '#f7f7f7'
        //     }
        //   })
        // maxBlock.transition().duration(animate ? 1000 : 0).attr('x', x(moment(minSkedDate).subtract(1, 'h').add(1, 'd').startOf('day')))
        //   .attr('width', xHour(60 * 24))
        //   .attr('fill', d => {
        //     var val = parseInt(moment(minSkedDate).subtract(1, 'h').add(1, 'd').startOf('day').add(1, 'h').format('d'))
        //     if (val === 0 || val === 2 || val === 4 || val === 6) {
        //       return '#fff'
        //     } else {
        //       return '#f7f7f7'
        //     }
        //   })

        stickyDate
          .text(moment(minSkedDate).subtract(moment(minSkedDate).diff(x.invert(25), 'm'), 'm').format('dddd'))

        currentTime
          .transition().duration(animate ? 1000 : 0)
          .attr('transform', `translate(${x(moment())},-5)`)

        steps
          .transition().duration(animate ? 1000 : 0).delay((d, i) => animate ? 15 * i : 0)
          .attr('transform', (d, i) => {
            var xTime = d.startTime
            return `translate(${x(xTime)}, ${y(i)})`
          })

        googleSteps
          .attr('transform', function (d, i) {
            var lastStepTimeMax = i === 0 ? 0 : d3.select(this.parentNode).data()[0].timeBreak[i - 1].timeIdeal || d3.select(this.parentNode).data()[0].timeBreak[i - 1].timeMin
            return `translate(${xHour(lastStepTimeMax)}, ${y(0)})`
          })

        googleStepsMin
          .transition().duration(animate ? 1000 : 0)
          .attr('width', d => xHour(d.timeMin))
        googleStepsMax
          .transition().duration(animate ? 1000 : 0)
          .attr('width', d => xHour(d.timeMax))

        maxRect
          .attr('width', d => {
            var w = xHour(d.timeBreak[0].timeMax)
            w = w < barHeight ? barHeight : w
            return w
          })
          .attr('rx', barHeight / 2)
          .attr('ry', barHeight / 2)
          .attr('x', d => {
            var w = xHour(d.timeBreak[0].timeMax)
            w = w < barHeight ? -barHeight / 2 : 0
            return w
          })

        // Min bar and circles
        minRect
          .attr('width', d => {
            var w = xHour(d.timeBreak[0].timeMin)
            w = w < barHeight ? barHeight : w
            return w
          })
          .attr('rx', barHeight / 2)
          .attr('ry', barHeight / 2)
          .attr('x', d => {
            var w = xHour(d.timeBreak[0].timeMin)
            w = w < barHeight ? -barHeight / 2 : 0
            return w
          })

        stepText
          .text((d, i) => {
            return d.category + ' at ' + that.$options.filters.time(d.startTime)
            // (i === 0 || i === data.length - 1 ? ' at ' + that.$options.filters.time(d.startTime) : '')
          })
          // .attr('class', d => {
          //   return xHour(d.timeBreak[0].timeMax) - barHeight < barHeight + 5 ? barHeight + 5 : barHeight / 2
          // })
          .attr('x', function (d) {
            // var textWidth = this.getComputedTextLength()
            // var parent = d3.select(this.parentNode)
            // var minW = parseFloat(parent.selectAll('.step-min-rect').attr('width'))
            // var maxW = parseFloat(parent.select('.step-max-rect').attr('width'))
            // var maxX = parseFloat(parent.selectAll('.step-max-rect').attr('x'))
            // return textWidth > minW - (barHeight / 2 + 10) ? maxW + maxX + 5 : barHeight / 2
          })
          // .style('fill', function (d) {
          //   var textWidth = this.getComputedTextLength()
          //   var parent = d3.select(this.parentNode)
          //   var minW = parseFloat(parent.selectAll('.step-min-rect').attr('width'))
          //   return textWidth > minW - (barHeight / 2 + 10) ? '#333' : 'white'
          // })
          .style('paint-order', function (d) {
            var textWidth = this.getComputedTextLength()
            var parent = d3.select(this.parentNode)
            var minW = parseFloat(parent.selectAll('.step-min-rect').attr('width'))
            return textWidth > minW - (barHeight / 2 + 10) ? 'stroke' : 'stroke'
          })
          .style('stroke', function (d) {
            return 'white'
            // var textWidth = this.getComputedTextLength()
            // var parent = d3.select(this.parentNode)
            // var minW = parseFloat(parent.selectAll('.step-min-rect').attr('width'))
            // return textWidth > minW - (barHeight / 2 + 10) ? 'white' : '#333'
          })
          .style('stroke-width', function (d) {
            var textWidth = this.getComputedTextLength()
            var parent = d3.select(this.parentNode)
            var minW = parseFloat(parent.selectAll('.step-min-rect').attr('width'))
            return textWidth > minW - (barHeight / 2 + 10) ? '3' : '1'
          })

        // startTimeText.text(d => that.$options.filters.time(d.startTime))

        // Save the states for use elsewhere
        // that.$store.commit('timer', {'prop': 'finishTimeMax', 'val': maxSkedDate.calendar(moment(that.$store.state.startDateSked)).replace('Tomorrow', 'tomorrow').replace('PM', 'p.m.').replace('AM', 'a.m.')})
        // that.$store.commit('recipe', {recipe: that.$store.state.recipe})
        that.$store.commit('startDate', moment(data[0].startTime))
        that.$store.commit('endDate', moment(data[data.length - 1].startTime)) // .add(that.$store.state.recipe.totalRecipeLength, 'm'))

        // Store recipe locally
        // window.localStorage.setItem(that.$store.state.recipe._id, JSON.stringify(that.$store.state.recipe))

        // console.log(that.$store.state.startDate, that.originalstartDate)
        // if (that.$store.state.startDate !== that.originalstartDate) {
        //   that.buttonSelected = 'custom'
        // }

        // Now move to a new spot
        // if (that.skedStartDateTarget) {
        //   that.skedStartDate = moment(that.skedStartDateTarget)
        //   that.skedStartDateTarget = null
        //   updateChart()
        // }
      }

      this.updateChart = function (params) {
        updateChart(params)
      }

      svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'transparent')
        .attr('class', 'no-touch')

      updateChart()

      setInterval(() => {
        currentTime
          .transition()
          .attr('transform', `translate(${x(moment())},-5)`)
      }, 1000 * 60)
      // console.log(window)
      if (window) d3.select(window).on('resize.updatesvg', updateChart(false, false))
    },

    showScheduler: function () {
      this.view = 'scheduler'
      this.$nextTick(() => this.makeViz())
    },
    toggleButton: function (sel) {
      if (sel === 'start' || sel === 'finish') {
        this.selectedStartEnd = sel
      } else {
        this.selectedTime = this.dateLabels[sel]
        this.buttonSelected = sel
      }
      // console.log(this.selectedStartEnd + '_' + this.selectedStartEnd)
      this.skedStartDate = this.dateDefaults[this.selectedStartEnd + '_' + this.buttonSelected]
      // Make data adjustments here before rebuilding the chart
      // Doing this because user might have modified position, so we need to carefully
      // Move them into a new position ...
      var data = this.recipe.steps // this.$store.state.recipe.steps
      for (var datum of data) {
        datum.startTime = null
        // datum.additiveTimeMin = null
        // datum.additiveTimeMax = null
      }
      // this.makeViz()
      this.processData()
      // console.log('updating chart')
      this.updateChart(true)
    },
    resetViz: function () {
      // this.$store.commit('startDate', this.originalStartDate)
      // this.buttonSelected = 'bake_now'
      var data = this.recipe.steps // this.$store.state.recipe.steps
      this.skedStartDate = this.dateDefaults.start_ideal || moment()
      this.selectedTime = this.dateDefaults.start_ideal ? 'at the ideal time' : 'right now'
      for (var datum of data) {
        datum.startTime = datum === data[0] ? this.skedStartDate : null
        // datum.additiveTimeMin = null
        // datum.additiveTimeMax = null
      }
      // Clear from local storage memory
      window.localStorage.removeItem(this.$store.state.recipe._id)
      // this.makeViz()
      this.processData()
      this.updateChart(true)
    },
    enoughTime: function (type) {
      return true
      // if (type === 'tonight') {
      //   return this.dateDefaults[this.selectedStartEnd + '_' + type].diff(this.$store.state.recipe.totalRecipeLength, 'm')
      // } else if (type === 'tomorrow_morning') {
      //
      // } else if (type === 'tomorrow_night') {
      //
      // }
    },
    loaves: function (loaves) {
      loaves = this.preferences.half ? loaves / 2 : loaves
      return !loaves ? '1 loaf' : loaves === 1 ? '1 loaf' : loaves + ' loaves'
    },
    setStarRating: function (i) {
      this.starFix = i
      // Set user rating just locally ahead of local storage
      this.$store.commit('userRating', i)
      // Commit to state
      this.$store.commit('recipe', {recipe: this.$store.state.recipe})
      // Set as local storage
      window.localStorage.setItem(this.$store.state.recipe._id, JSON.stringify(this.$store.state.recipe))
      // // Save to database
      // this.$store.dispatch('updateStarRating', {recipe_id: this.$store.state.recipe._id, rating: this.starFix})
    },
    starHover: function (i, out) {
      this.starActive = !out
      this.starSel = i
    },
    timeToNextStep: function (step) {
      // this start time to next start time
      var nextStep
      var i = 0
      for (var thisStep of this.$store.state.recipe.steps) {
        if (step.category === thisStep.category) {
          // get next step
          nextStep = this.$store.state.recipe.steps[i + 1] ? this.$store.state.recipe.steps[i + 1].startTime : 0
        }
        i++
      }
      return nextStep ? moment(nextStep).diff(moment(step.startTime), 'm') : step.timeBreak[0].timeMin
    },
    thumbnail: function (url) {
      return url.replace('image/upload/', 'image/upload/c_scale,w_348/')
    },
    half: function (step) {
      return this.convertMeasurement({amount: step.amount / 2})
    },
    processEndDate: function (endDate) {
      return moment(endDate).add(2, 'h')
    },
    stepImage: function (step) {
      var start = '<img src="'
      var end = '" class="w-100" />'
      if (step.category.toLowerCase().match(/autolyse/gi) !== null || step.category.toLowerCase().match(/premix/gi) !== null) return start + this.thumbnail('static/autolyse-sm.jpg') + end

      if (step.category.toLowerCase().match(/levain/gi) !== null || step.category.toLowerCase().match(/feed/gi) !== null) return start + this.thumbnail('static/levain-sm.jpg') + end

      if (step.category.toLowerCase().match(/mix/gi) !== null) return start + this.thumbnail('static/mix-sm.jpg') + end

      if (step.step.match(/salt/gi) !== null) return start + this.thumbnail('static/salt-sm.jpg') + end

      if (step.category.toLowerCase().match(/bulk/gi) !== null) return start + this.thumbnail('static/bulk-sm.jpg') + end

      if (step.step.match(/stretch/gi) !== null || step.step.match(/fold/gi) !== null) return start + this.thumbnail('static/stretch-fold-sm.jpg') + end

      if (step.step.match(/pre-/gi) !== null || step.step.match(/preshap/gi) !== null) return start + this.thumbnail('static/preshape-sm.jpg') + end

      if (step.step.match(/shap/gi) !== null) return start + this.thumbnail('static/shaping-sm.jpg') + end

      if (step.step.match(/proof/gi) !== null) return start + this.thumbnail('static/proof-sm.jpg') + end

      if (step.step.match(/cut/gi) !== null) return start + this.thumbnail('static/cutting-sm.jpg') + end

      if (step.step.match(/bake/gi) !== null || step.category.match(/bake/gi) !== null) return start + this.thumbnail('static/bread2.jpg') + end

      return ''
    },
    calendar: function (startDate) {
      return startDate ? startDate.calendar(moment()).replace('Tomorrow', 'tomorrow').replace('Today', 'today').replace('PM', 'p.m.').replace('AM', 'a.m.').replace(' at', ' at <strong><span class="text-primary">') + '</span></strong>' : ''
    },
    endTime: function (startDate) {
      return startDate ? startDate.add(this.$store.state.recipe.totalRecipeLength, 'm').calendar(startDate).replace('Tomorrow', 'tomorrow').replace('Today', 'today').replace('PM', 'p.m.').replace('AM', 'a.m.').replace(' at', ' at <strong><span class="text-primary">') + '</span></strong>' : ''
      // return startDate ? moment(startDate).add(this.$store.state.recipe.totalRecipeLength, 'm').calendar(moment(startDate)).replace(/.$/, '').replace('Tomorrow', 'tomorrow').replace('Today', 'today').replace('PM', 'p.m.').replace('AM', 'a.m.') : ''
    },
    setMeasurement: function (measurement) {
      this.preferences.measurement = measurement
    },
    getPercentages: function (data, item) {
      return Math.round((item.amount / data.totalFlour) * 100) + '%'
    },
    convertMeasurement: function (ingredient) {
      ingredient.amount = Number(String(ingredient.amount).replace(/[A-Za-z]/gi, ''))
      if (this.preferences.measurement === 'grams') {
        // Return as default grams
        return ingredient.amount + 'g'
      } else if (this.preferences.measurement === 'ounces') {
        // Calculate to ounces
        return (ingredient.amount * 0.035274).toFixed(2) + 'oz'
      } else if (this.preferences.measurement === 'volume') {
        return (ingredient.amount / 120).toFixed(2) + 'cups'
      }
    },
    startTimer: function (step) {
      var that = this
      // var timeBreak = timeToNextStep(step)
      this.timerActive = step
      var min = this.timeToNextStep(step)
      // var max = timeBreak.timeMax
      that.$store.commit('timer', {'prop': 'title', 'val': this.$store.state.recipe.title})
      that.$store.commit('timer', {'prop': 'end', 'val': moment().add(min, 'm')})
      // function getFreshTime () {
      //   var now = moment()
      //   var diff = moment.duration(that.$store.state.timer.end.diff(now))
      //   var hours = diff.hours()
      //   var minutes = diff.minutes()
      //   minutes = minutes < 10 ? '0' + minutes : minutes
      //   var seconds = diff.seconds()
      //   seconds = seconds < 10 ? '0' + seconds : seconds
      //   that.$store.commit('timer', {'prop': 'timeLeft', 'val': hours + ':' + minutes + ':' + seconds})
      // }
      // var t = setInterval(function () {
      //   getFreshTime()
      // }, 1000)
      // this.$store.commit('timer', {'prop': 't', 'val': t})
      // getFreshTime()
      this.$store.dispatch('showTimer')
    },
    async getRecipe (recipe) {
      // this.$router.push('recipe/' + recipe._id + '/edit')
      this.recipe_id = this.$route.path.replace('recipe', '').replace('edit', '').replace(/\//gi, '')
      if (!recipe) recipe = {_id: this.recipe_id}
      if (recipe._id !== '') {
        // window.location.hash = `${record._id}/edit`
        // this.$router.push({ path: `${recipe._id}/edit` })
        await this.$store.dispatch('getRecipe', recipe)
      }
    }
  }
}
</script>
