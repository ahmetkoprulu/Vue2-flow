<template>
  <div id="app">
    <Chart
      ref="flowChart"
      :nodes="nodes"
      :connections="connections"
      :footer-style="{ 'margin-left': '35%' }"
      :enableConnContextMenu="true"
      :enableNodeContextMenu="true"
      :connLineType="'step'"
    >
      <div
        slot="nodeContextmenu"
        slot-scope="props"
        class="context__container d-inline-flex"
      >
        <div class="context__button">
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
        <div
          class="context__button-2"
          @click="$refs.flowChart.removeNode(props.node.id)"
        >
          <a href="javascript:;" class="context__link">
            <i class="bi bi-trash3"></i>
          </a>
        </div>
      </div>
      <div slot="connContextmenu" class="context__container"></div>

      <div class="toolbar" slot="footer">
        <div class="context__button">
          <a href="javascript:;" class="context__link">
            <i class="bi bi-cursor"></i>
          </a>
        </div>
        <div class="context__button">
          <a href="javascript:;" class="context__link">
            <i class="bi bi-hand-index-thumb"></i>
          </a>
        </div>
        <div class="context__button" @click="$refs.flowChart.addNode()">
          <a href="javascript:;" class="context__link">
            <i class="bi bi-plus-lg"></i>
          </a>
        </div>
        <div class="context__button">
          <a href="javascript:;" class="context__link">
            <i class="bi bi-arrow-counterclockwise"></i>
          </a>
        </div>
        <div class="context__button">
          <a href="javascript:;" class="context__link">
            <i class="bi bi-arrow-clockwise"></i>
          </a>
        </div>
      </div>
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
          x: 85.32548522949219,
          y: 181.67115783691406,
          width: 80,
          height: 40,
          name: "Start",
          type: "input",
          shape: "rect",
          style: {
            backgroundColor: "lightgrey",
            color: "lightgrey",
            borderColor: "lightgrey",
            borderWidth: "3px",
          },
        },
        {
          id: 2,
          x: 576.8151245117188,
          y: 173.6366729736328,
          width: 80,
          height: 40,
          name: "Done",
          type: "output",
          shape: "rect",
          style: {
            backgroundColor: "white",
            color: "green",
            borderColor: "lightgreen",
            borderWidth: "3px",
          },
        },
        {
          id: "d070e195-b70c-4635-b639-b6d27e1f5b1e",
          x: 237.9583740234375,
          y: 99.05230712890625,
          width: 80,
          height: 40,
          name: "Backlog",
          type: "io",
          shape: "rect",
        },
        {
          id: "9519aec4-52df-47a6-b2f0-b84c177eafbe",
          x: 370.6851501464844,
          y: 183.736572265625,
          width: 80,
          height: 40,
          name: "To Do",
          type: "io",
          shape: "rect",
        },
        {
          id: "0a7b48ec-cbd1-4f9a-8491-a80941712f99",
          x: 243.53701782226562,
          y: 257.6601867675781,
          width: 134.16165161132812,
          height: 39.097320556640625,
          name: "In Progress",
          type: "io",
          shape: "rect",
        },
        {
          id: "0a7b48ec-cbd1-4f9a-8491-a80941712f91",
          x: 421.5058288574219,
          y: 257.04852294921875,
          width: 80,
          height: 40,
          name: "In Review",
          type: "io",
          shape: "rect",
        },
      ],
      connections: [
        {
          id: "449a3934-ddd4-469c-842a-43a6f7c1dfa1",
          source: {
            id: 1,
            position: "right",
          },
          destination: {
            id: "d070e195-b70c-4635-b639-b6d27e1f5b1e",
            position: "left",
          },
          type: "step",
          style: {
            borderColor: "#b1b1b7",
            borderWidth: "2px",
          },
        },
        {
          id: "e6ed4172-310a-41c0-8eed-05456ec04232",
          source: {
            id: "d070e195-b70c-4635-b639-b6d27e1f5b1e",
            position: "right",
          },
          destination: {
            id: "9519aec4-52df-47a6-b2f0-b84c177eafbe",
            position: "left",
          },
          type: "bezier",
          style: {
            borderColor: "#b1b1b7",
            borderWidth: "2px",
          },
        },
        {
          id: "829ab3ac-66c9-4315-a7cc-220a76c938da",
          source: {
            id: "9519aec4-52df-47a6-b2f0-b84c177eafbe",
            position: "right",
          },
          destination: {
            id: "d070e195-b70c-4635-b639-b6d27e1f5b1e",
            position: "left",
          },
          type: "step",
          markerEnd: "arrowclosed",
          style: {
            borderColor: "red",
            borderWidth: "2px",
          },
        },
        {
          id: "be9637ae-ef9e-4bb2-adf4-941120e16237",
          source: {
            id: "9519aec4-52df-47a6-b2f0-b84c177eafbe",
            position: "right",
          },
          destination: {
            id: "0a7b48ec-cbd1-4f9a-8491-a80941712f99",
            position: "left",
          },
          type: "step",
          markerEnd: "arrow",
          style: {
            borderColor: "#b1b1b7",
            borderWidth: "2px",
          },
        },
        {
          id: "23a532b7-f944-479d-abd3-013aeda80454",
          source: {
            id: "0a7b48ec-cbd1-4f9a-8491-a80941712f99",
            position: "right",
          },
          destination: {
            id: "0a7b48ec-cbd1-4f9a-8491-a80941712f91",
            position: "left",
          },
          type: "step",
          markerEnd: "arrow",
          style: {
            borderColor: "#b1b1b7",
            borderWidth: "2px",
          },
        },
        {
          id: "fe8dbf1e-74fc-4dca-8d67-e93014258ce5",
          source: {
            id: "0a7b48ec-cbd1-4f9a-8491-a80941712f91",
            position: "right",
          },
          destination: {
            id: 2,
            position: "left",
          },
          type: "bezier",
          markerEnd: "arrowclosed",
          style: {
            animated: true,
            borderColor: "#b1b1b7",
            borderWidth: "2px",
          },
        },
      ],
    };
  },
  methods: {},
  components: {
    Chart,
  },
};
</script>

<style>
.toolbar {
  height: 50px;

  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
  padding: 0px;

  background: #ffffff;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
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
