<template>
  <div id="app">
    <FlowChartEditor />
  </div>
</template>

<script>
import FlowChartEditor from "../examples/Editor.vue";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    FlowChartEditor,
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  display: flex;
  height: 100vh;
}
</style>
