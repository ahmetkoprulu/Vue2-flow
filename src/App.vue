<template>
  <div id="app">
    <Chart
      @connection-click="onConnectionClicked"
      @node-click="onConnectionClicked"
      @node-contextmenu="onConnectionClicked"
      :nodes="nodes"
      :connections="connections"
      :footer-style="{ 'margin-left': '35%' }"
    >
      <div class="w-100" slot="footer"><div class="toolbar"></div></div>
    </Chart>
  </div>
</template>

<script>
import Chart from "./components/FlowChart.vue";
export default {
  name: "App",
  data() {
    return {
      nodes: [
        {
          id: 1,
          x: 84.453125,
          y: 189,
          width: 120,
          height: 50,
          name: "Start",
          type: "input",
          shape: "rect",
        },
        {
          id: 2,
          x: 782.453125,
          y: 188,
          width: 120,
          height: 50,
          name: "End",
          type: "output",
          shape: "rect",
        },
        {
          id: "d070e195-b70c-4635-b639-b6d27e1f5b1e",
          x: 427.453125,
          y: 73,
          width: 120,
          height: 50,
          name: "IK Onay",
          type: "start",
          shape: "rect",
        },
        {
          id: "9519aec4-52df-47a6-b2f0-b84c177eafbe",
          x: 326.453125,
          y: 339,
          width: 120,
          height: 50,
          name: "Yonetici Onay",
          type: "start",
          shape: "rect",
        },
        {
          id: "0a7b48ec-cbd1-4f9a-8491-a80941712f99",
          x: 550.453125,
          y: 338,
          width: 120,
          height: 50,
          name: "Son Onay",
          type: "start",
          shape: "rect",
        },
      ],
      connections: [
        {
          id: "357080f7-b3d3-4d4a-bfdd-0ddfb6c42905",
          source: {
            id: 1,
            position: "right",
          },
          destination: {
            id: "d070e195-b70c-4635-b639-b6d27e1f5b1e",
            position: "left",
          },
          type: "bezier",
          animated: true,
          markerEnd: "arrow",
        },
        {
          id: "b3c13204-0003-4619-ad92-8514eeaf9e6c",
          source: {
            id: 1,
            position: "right",
          },
          destination: {
            id: "9519aec4-52df-47a6-b2f0-b84c177eafbe",
            position: "left",
          },
          type: "bezier",
          markerEnd: "arrowclosed",
        },
        {
          id: "c7712c70-07cf-42e4-ae72-289407decb42",
          source: {
            id: "9519aec4-52df-47a6-b2f0-b84c177eafbe",
            position: "right",
          },
          destination: {
            id: "0a7b48ec-cbd1-4f9a-8491-a80941712f99",
            position: "left",
          },
          type: "bezier",
          markerEnd: "arrowclosed",
        },
        {
          id: "0dbba44a-3356-4504-b814-6b08ae3a005d",
          source: {
            id: "d070e195-b70c-4635-b639-b6d27e1f5b1e",
            position: "right",
          },
          destination: {
            id: 2,
            position: "left",
          },
          type: "smoothstep",
        },
        {
          id: "0936c57d-680a-4ec6-8bc8-6c73feb04c74",
          source: {
            id: "0a7b48ec-cbd1-4f9a-8491-a80941712f99",
            position: "right",
          },
          destination: {
            id: 2,
            position: "left",
          },
          type: "step",
        },
      ],
    };
  },
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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
