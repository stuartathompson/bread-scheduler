<template>

<!--  NO LONGER USED — ALL THIS MOVED TO RECIPE -->







        <!-- <b-row class="border border-right-0 border-bottom-0 border-left-0">
          <hr />
          <b-col>
            <b-form-radio-group v-model="timeOption" class="row text-medium p-4">
              <b-radio value="hours" class="d-inline">Start later</b-radio>
              <b-radio value="start" class="d-inline">Start at a specific time</b-radio><br />
              <b-radio value="end" class="d-inline">Finish at a specific time</b-radio><br />
            </b-form-radio-group>
          </b-col>
        </b-row> -->
      <!-- <b-row>
        <b-col>
          <vueSlider @callback="updateViz" v-model="sliderHours" v-show="timeOption === 'hours'" :max="max" :tooltip="tooltip"></vueSlider>
          <b-input v-show="timeOption === 'start'" ></b-input>
          <b-input v-show="timeOption === 'end'" ></b-input>
        </b-col>
      </b-row> -->

  <div class="">
    <!-- border border-right-0 border-left-0 border-bottom-0 -->
    <b-row class="pl-4 pr-4 pb-3 pt-4">
      <b-col>
        <b-row>
          <b-col class="pb-2">
            <!-- <b-link @click="autoFit()">autofit</b-link> -->
              I want to
            {{ recipe.title }}
              <b-dropdown size="sm" :text="selectedStartEnd">
                <b-dropdown-item class="text-medium" @click="toggleButton('start')" size="sm">start</b-dropdown-item>
                <b-dropdown-item class="text-medium" @click="toggleButton('finish')" size="sm">finish</b-dropdown-item>
              </b-dropdown>
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
      <b-table thead-class="d-none" :items="recipe.steps" :fields="stepTimelineFields" class="w-100 table-no-top-rule">
        <template slot="category" slot-scope="data">
          {{ data.item.category }}
        </template>
        <template slot="day" slot-scope="data">
          {{ day(data.item) }}
        </template>
        <template slot="startTime" slot-scope="data">
          {{ data.item.startTime | time }}
        </template>
        <!-- <template slot="to" slot-scope="data">
          <span v-if="data.item.timeBreak[0].timeMin !== data.item.timeBreak[0].timeMax" class="text-lighter">to</span>
        </template> -->
        <!-- <template slot="endTime" slot-scope="data">
          <span class="text-lighter">{{ data.item | endTime }}</span>
        </template> -->
      </b-table>
    </b-col>
    <!-- <b-row class="pl-4 pr-4 pb-4">
      <b-col>
        <b-checkbox size="sm" class="text-small ml-2" v-model="autosave" :checked="autosave">Saving your changes</b-checkbox>
      </b-col>
    </b-row> -->
  </div>
</template>

<script>
import moment from 'moment'
import vueSlider from 'vue-slider-component'
const d3 = require('d3')
export default {
  name: 'Viz',
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
      recipe: this.initialRecipe,
      dateDefaults: {
        'start_ideal': this.$store.state.recipe.recommendedTimes && this.$store.state.recipe.recommendedTimes[0] ? moment().startOf('day').add(this.$store.state.recipe.recommendedTimes[0].startTime, 'h') : moment(),
        'start_now': moment(),
        'start_tonight': moment().startOf('day').add(19, 'h'),
        'start_tomorrow_morning': moment().add(1, 'd').startOf('day').add(9, 'h'),
        'start_tomorrow_night': moment().add(1, 'd').startOf('day').add(19, 'h'),
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
      stepTimelineFields: [
        {
          key: 'day',
          class: 'text-strong text-primary'
        },
        {
          key: 'startTime',
          class: 'text-nowrap'
        },
        // {
        //   key: 'to',
        //   class: 'pl-0 pr-0'
        // },
        // {
        //   key: 'endTime',
        //   class: 'text-nowrap'
        // },
        {
          key: 'category',
          class: 'text-nowrap w-100'
        }
      ],
      skedStartDate: null,
      skedStartDateTarget: null,
      buttonSelected: 'now',
      days: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
      timeOption: 'hours',
      sliderHours: 0,
      // originalRecipe: Object.assign({}, this.$store.state.recipe),
      originalstartDate: this.$store.state.startDate
    }
  },
  components: {
    vueSlider
  },
  props: ['initialRecipe'],
  mounted () {
    console.log('mounted viz')

    this.$forceUpdate()
    // this.getRecipe()
    this.makeViz()
    // this.saveRecipeCopy()
  },
  created () {
    console.log('created viz')
  },
  computed: {
    startDate: function () {
      return this.$store.state.startDate
    }
    // recipe: function () {
    //   console.log(this.recipe)
    //   return this.recipe
    //   // return this.$store.state.recipe
    // }
  },
  // watch: {
  //   // '$route': function (newId, oldId) {
  //   //   console.log('viz watch loaded', newId, oldId)
  //   //   this.makeViz()
  //   //   // this.getUser(newId)
  //   // },
  //   // whenever question changes, this function will run
  //   recipe: function (recipe) {
  //     this.recipe = recipe
  //   }
  // },
  filters: {
    time: function (time) {
      return moment(time).format('h:mm a')
    },
    endTime: function (step) {
      return step.timeBreak[0].timeMin === step.timeBreak[0].timeMax ? '' : moment(step.startTime).add(step.timeBreak[0].timeMax, 'm').format('h:mm a')
    },
    hours: function (value) {
      return value > 60 ? (value / 60).toFixed(1) + ' hours' : value < 60 ? value + ' minutes' : 1 + ' hour'
    }
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
    updateViz: function () {
      this.makeViz()
    },
    autoFit: function () {
      // this.$store.commit('startDate', this.originalStartDate)
      // this.buttonSelected = 'bake_now'
      var format = 'hh:mm:ss'
      var nightStartTime = moment('21:00:00', format)
      var nightEndTime = moment('07:00:00', format)
      var data = this.recipe.steps // this.$store.state.recipe.steps
      this.skedStartDate = moment()
      var i = 0
      for (var datum of data) {
        var startTimeHours = moment(datum.startTime, format)
        var endTimeHours = moment(moment(datum.startTime).add(datum.timeBreak[0].timeMax, 'm'), format)
        // console.log('checking', datum.category, startTimeHours, endTimeHours)
        // console.log(startTimeHours.isBefore(nightStartTime, nightEndTime), endTimeHours.isBefore(nightStartTime, nightEndTime))
        if (startTimeHours.isBefore(nightStartTime, nightEndTime) || endTimeHours.isBefore(nightStartTime, nightEndTime)) {
          // console.log('over time... moving')
          // Get time between current step start time and goal end time
          var amountToMove = moment(datum.startTime).diff(nightEndTime, 'h')
          var j = 0
          for (var datums of data) {
            if (j >= i) datums.startTime = moment(datums.startTime.add(amountToMove, 'h'))
            j = j + 1
          }
        } else {
          // console.log('not over time, keeping')
        }
        if (i === 0) {
          this.skedStartDate = moment(datum.startTime)
        }
        i = i + 1
        this.recipe.steps = data
      }
      // this.makeViz()
      this.processData()
      this.updateChart(true)
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
    getMinStepTime: function (timeBreakStep) {
      // Gets the minimum amount of time in each step by adding up min time breaks
      // This is used to adjust following step start times by the amount of time
      // taken by the previous step
      var ret = 0
      for (var step of timeBreakStep) {
        ret += Number(step.timeMin)
      }
      return ret
    },
    getMaxStepTime: function (timeBreakStep) {
      // Gets the maximum amount of time in each step by adding up max time breaks
      // This is used to adjust following step start times by the amount of time
      // taken by the previous step
      var ret = 0
      for (var step of timeBreakStep) {
        ret += Number(step.timeMax)
      }
      return ret
    },
    makeViz: function () {
      var that = this
      // console.log('recipe', this.recipe)
      var data = this.recipe.steps // this.$store.state.recipe.steps

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
        this.recipe.steps = data
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

      console.clear()
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
        that.$store.commit('recipe', {recipe: that.$store.state.recipe})
        that.$store.commit('startDate', moment(data[0].startTime))
        that.$store.commit('endDate', moment(data[data.length - 1].startTime)) // .add(that.$store.state.recipe.totalRecipeLength, 'm'))

        // Store recipe locally
        // window.localStorage.setItem(that.$store.state.recipe._id, JSON.stringify(that.$store.state.recipe))

        // console.log(that.$store.state.startDate, that.originalstartDate)
        // if (that.$store.state.startDate !== that.originalstartDate) {
        //   that.buttonSelected = 'custom'
        // }

        // Now move to a new spot
        if (that.skedStartDateTarget) {
          that.skedStartDate = moment(that.skedStartDateTarget)
          that.skedStartDateTarget = null
          updateChart()
        }
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

      this.recipe.steps = data
    }
  }
}
</script>
