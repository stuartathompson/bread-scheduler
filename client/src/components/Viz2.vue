<template>
  <div class="">
    my title: {{ recipe.title }}
  </div>
</template>

<script>
export default {
  name: 'Viz2',
  data () {
    return {
      viz: [],
      recipe: this.initialRecipe
    }
  },
  mounted () {
  },
  props: ['initialRecipe'],
  methods: {
  }
}
</script>
