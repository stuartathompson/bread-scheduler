<template>
  <div class="records container-fluid p-3 p-sm-3 p-md-4">
    <b-modal id="modal_info" ref="modal_info" centered @ok="goToLink()" ok-variant="primary" no-fade :title="modalData.title2 ? modalData.title2 + ' (Case #' + modalData.parent_id + ')': 'Case #' + modalData.title" header-text-variant="light" small :header-bg-variant="modalData.title2 ? 'primary' : 'secondary'" ok-title="Edit">
        <p class="text-large" v-if="modalData.date">{{ modalData.date | date }}</p>
        <p class="text-large" v-if="modalData.description">
          {{ modalData.description }}
        </p>
    </b-modal>
    <div class="row">
      <div class="col-12">
          <calendar-view
            :events="calendarRecords"
            :show-date="showDate"
            event-content-height="1.6em"
            :onPeriodChange="periodChange"
            @click-event="openRecord"
            @click-date="openDate"
            class="theme-default holiday-us-traditional holiday-us-official">
            <calendar-view-header
              slot="header"
              slot-scope="t"
              :header-props="t.headerProps"
              @input="setShowDate" />
          </calendar-view>

      </div>
    </div>
  </div>
</template>

<script>
import RecipeService from '@/services/RecipeService'
import AuthService from '@/services/AuthService'
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar'
import moment from 'moment'

require('vue-simple-calendar/static/css/default.css')
require('vue-simple-calendar/static/css/holidays-us.css')

export default {
  name: 'calendar',
  data () {
    return {
      showDate: new Date(),
      modalData: {},
      queryStartDate: moment().startOf('month'),
      queryEndDate: moment().endOf('month'),
      queriedDates: []
    }
  },
  components: {
    CalendarView,
    CalendarViewHeader
  },
  created () {
  },
  beforeMount () {
    this.auth()
    this.queriedDates.push(this.queryStartDate.format('MM-DD-YYYY'))
    // this.getRecords()
  },
  computed: {
    record: function () {
      return this.$store.state.record
    },
    records: function () {
      return this.$store.state.records
    },
    calendarRecords: function () {
      if (this.$store.state.records === null) return []
      var calendarRecords = []
      // Format data correctly and append to calendar records
      for (let record of this.$store.state.records) {
        record.startDate = record.date
        record.classes = 'p-2 bg-secondary text-light'
        record.title = record.record_id
        record.url = '/' + record._id + '/edit'
        calendarRecords.push(record)
      }
      for (let record of this.$store.state.records) {
        console.log(record.children)
        if (record.children && record.children.length !== 0) {
          for (var child of record.children) {
            child.startDate = child.date
            child.title2 = child.title
            child.title = record.record_id + ' - ' + child.title
            child.classes = 'p-2 bg-primary text-light'
            child.url = '/' + record._id + '/edit'
            child.this_id = record._id + '_' + child.record_id
            child.parent_id = record.record_id
            child.record_record_id = record.record_id
            calendarRecords.push(child)
          }
        }
      }
      return calendarRecords
    }
  },
  mounted () {
  },
  filters: {
    date: function (value) {
      if (!value) return
      return moment(value).format('MMMM D, YYYY')
    }
  },
  methods: {
    setShowDate (d) {
      this.showDate = d
    },
    periodChange (params) {
      this.queryStartDate = moment(params.periodStart)
      this.queryEndDate = moment(params.periodEnd)
      // Get records if not yet gotten
      let found = false
      for (let date of this.queriedDates) {
        if (date === this.queryStartDate.format('MM-DD-YYYY')) found = true
      }
      if (!found) {
        this.queriedDates.push(this.queryStartDate.format('MM-DD-YYYY'))
        this.getRecords()
      }
    },
    async getRecords (append) {
      const response = await RecipeService.records({
        page: this.currentPage,
        limit: this.perPage,
        username: localStorage.getItem('username'),
        fields: 'children',
        startDate: this.queryStartDate,
        endDate: this.queryEndDate
      })
      // Format data correctly and append to calendar records
      for (let record of response.data.records) {
        record.startDate = record.date
        record.classes = 'p-2 bg-secondary text-light'
        record.title = record.record_id
        record.url = '/' + record._id + '/edit'
        this.calendarRecords.push(record)
      }
      for (let record of response.data.records) {
        if (record.children && record.children.length !== 0) {
          for (var child of record.children) {
            child.startDate = child.date
            child.title2 = child.title
            child.title = record.record_id + ' - ' + child.title
            child.classes = 'p-2 bg-primary text-light'
            child.url = '/' + record._id + '/edit'
            child.this_id = record._id + '_' + child.record_id
            child.parent_id = record.record_id
            child.record_record_id = record.record_id
            this.calendarRecords.push(child)
          }
        }
      }
      if (response.data.success) {
        if (append) {
          this.records = this.records.concat(response.data.records)
        } else {
          this.records = response.data.records
          // If no records and not part of an appaned, then there are no records so show warning
          if (this.records.length === 0) {
            this.noRecords = true
          }
        }
        this.allRecords = this.records
        // this.totalRows = this.records.length
      } else if (response.data.redirect) {
        // window.location = response.data.redirect
        this.$router.push(response.data.redirect)
      } else {
        // Default redirect : Only logged in users should be here
        // window.location = '/login'
        // this.$router.push('login')
        // ERR
      }
    },
    openDate (e) {
    },
    openRecord (child) {
      this.modalData = {}
      this.modalData = child.originalEvent
      this.$refs.modal_info.show()
    },
    goToLink (link) {
      this.$router.push(this.modalData.url)
    },
    async auth () {
      if (!localStorage.getItem('token')) {
        this.$router.push('login')
      } else {
        const response = await AuthService.auth({ token: localStorage.getItem('token') })
        if (response.data.success) {
          this.auth = true
        } else {
          this.$router.push('login')
        }
      }
    }
  }
}
</script>
