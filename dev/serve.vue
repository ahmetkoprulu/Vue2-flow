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
.toolbar {
  width: 400px;
  height: 50px;
  border: 1px solid #ccc;
  background-color: white;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}

.context__container {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;

  position: absolute;
  width: 358.2px;
  height: 56px;

  background: #ffffff;
  /* shadow */

  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
}

.context__button {
  /* Frame 46424 */

  /* Auto layout */

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  gap: 10px;

  height: 100%;

  background: #ffffff;

  /* Inside auto layout */

  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 0;
}

.context__button-2 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  gap: 10px;

  height: 100%;

  /* Greys/Cool Grey/50 */

  background: #f9fafb;
  border-radius: 0px 4px 4px 0px;
  color: #9ca3af;
  /* Inside auto layout */

  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 0;
}

.context__link {
  margin: auto;
  text-decoration: none;
  color: #9ca3af;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
}
</style>
