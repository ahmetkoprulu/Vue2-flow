<template>
  <div id="app">
    <Chart
      @connection-click="onConnectionClicked"
      @node-click="onConnectionClicked"
      @node-contextmenu="onConnectionClicked"
      :nodes="nodes"
      :connections="connections"
      :footer-style="{ 'margin-left': '35%' }"
      :enableConnContextMenu="true"
      :enableNodeContextMenu="true"
      :connLineBorderColor="'green'"
      :connLineType="'step'"
    >
      <div slot="nodeContextmenu" class="context__container d-inline-flex">
        <div class="context__button-2">
          <a href="javascript:;" class="context__link my-auto d-inline-flex">
            <i class="bi bi-circle-fill bg-white"></i
            ><i class="bi bi-caret-down"></i>
          </a>
        </div>
        <div class="context__button">
          <a href="javascript:;" class="context__link">
            <i class="bi bi-border-outer"></i>
          </a>
        </div>
        <div class="context__button">
          <a href="javascript:;" class="context__link">
            <i class="bi bi-type-underline"></i>
          </a>
        </div>
        <div class="context__button" style="width: 150px">
          <select class="form-select" aria-label="Default select example">
            <option selected>Small</option>
          </select>
        </div>
        <div class="context__button-2">
          <a href="javascript:;" class="context__link">
            <i class="bi bi-trash3"></i>
          </a>
        </div>
      </div>
      <div slot="connContextmenu" class="context__container"></div>

      <div class="w-100" slot="footer"><div class="toolbar"></div></div>
    </Chart>
  </div>
</template>

<script>
import Chart from "@/components/FlowChart.vue";
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
          style: {
            backgroundColor: "orange",
            color: "purple",
            borderColor: "purple",
            borderWidth: "3px",
          },
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
          name: "Yonetici Onayasda",
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
          style: {
            animated: true,
            borderColor: "cyan",
            borderWidth: "3px",
          },
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
          style: {
            borderColor: "red",
          },
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
          style: {
            borderColor: "blue",
          },
        },
      ],
    };
  },
  methods: {
    onConnectionClicked(conn) {},
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
