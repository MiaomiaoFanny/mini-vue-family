<template>
  <div>
    <h1>Vuex Demo</h1>
    <p>name: {{name}}</p>
    <p>count: {{$store.state.count}} |
      dbCount: {{dbCount}} |
      triCount: {{$store.getters.triCount}}
      triCount2: {{triCount2}}
    </p>
    <p><button @click.prevent="add(1)">Add 1</button></p>
    <p><button @click.prevent="add(2)">Add 2</button></p>
    <p><button @click.prevent="increment(3)">mutation Increment 3</button></p>
    <p><button @click.prevent="increment2(4)">action Increment 4</button></p>
  </div>
</template>

<script>
import Vuex from '../vuex'
const { mapState, mapMutations, mapActions, mapGetters } = Vuex

export default {
  computed: {
    ...mapState(['name']),
    ...mapGetters(['dbCount']),
    ...mapGetters({
      triCount2: 'triCount',
    }),
  },
  methods: {
    add(n = 1) {
      this.$store.dispatch('increment', n)
    },
    ...mapMutations(['increment']),
    ...mapActions({
      increment2:  'increment'
    }),
  }

}
</script>

<style>

</style>