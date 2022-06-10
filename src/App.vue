<template>
  <div id="app">
    <Chart
      @connection-click="onConnectionClicked"
      @node-click="onConnectionClicked"
      @node-contextmenu="onConnectionClicked"
    />
  </div>
</template>

<script>
import Chart from "./components/FlowChart.vue";
export default {
  name: "App",
  methods: {
    onConnectionClicked(conn) {
      console.log(conn);
    },
  },
  components: {
    Chart,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
