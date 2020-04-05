<template>
  <div class="news-record row">
    <div class="col">
      <h4>Happy Sunday, {{ username}}</h4>
      <p>
        Here's what you need to do today.
      </p>
      <ul>
        <b-checkbox>
          Call sources for <b-link class="text-primary bg-light p-1">HOUSERACES</b-link>
        </b-checkbox>
      </ul>
    </div>
  </div>
</template>

<script>
// import RecordsService from '@/services/RecordsService'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
// import FormData from 'form-data'

export default {
  name: 'addrecord',
  data () {
    return {
    }
  },
  filters: {
    date: function (value) {
      // if (!value) return
      // console.log(moment)
      return moment(value).format('D MMM, YYYY')
    }
  },
  components: {
    Datepicker
  },
  methods: {
    addRecord () {
      console.log('adding!')
    }
  }
}
</script>
