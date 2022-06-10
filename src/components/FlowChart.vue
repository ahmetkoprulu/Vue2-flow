<template>
  <div>
    <button @click="addNode">sa</button>
    <svg
      style="border: 1px solid #ccc"
      width="960"
      height="500"
      @mousemove="onChartMouseMove"
      @mouseup="onChartMouseUp"
      @contextmenu.prevent="$emit('chart-contextmenu', $event)"
      @click="$emit('chart-click', $event)"
    >
      <Background :width="960" :height="500" :transformation="transformation" />
      <g id="nodes">
        <Node
          :node="n"
          :transformation="transformation"
          @connecting="onConnecting"
          @connected="onConnected"
          @click="$emit('node-click', $event)"
          @contextmenu="$emit('node-contextmenu', $event)"
          v-for="n in internalNodes"
          :key="n.id"
        />
      </g>
      <g id="connections">
        <ConnectionMarkerRenderer :connections="connectionMarkers" />
        <ConnectionWrapper
          :conn="conn"
          v-for="conn in includedConnection"
          :key="conn.id"
          @click="$emit('connection-click', $event)"
          @contextmenu="$emit('connection-contextmenu', $event)"
        />
      </g>
      <ConnectionLine :info="connectingInfo" v-if="connecting" />
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import { uuidv4 } from "@/utils/math";

import Background from "./Background";
import Node from "./nodes/node-wrapper.vue";
import ConnectionLine from "./ConnectionLine.vue";
import ConnectionWrapper from "./conns/ConnectionWrapper.vue";
import ConnectionMarkerRenderer from "./markers/ConnectionMarkerRenderer";

export default {
  name: "FlowChart",
  data() {
    return {
      internalNodes: [
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
      internalConnections: [
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
      connecting: false,
      connectingInfo: {
        source: null,
        sourcePosition: null,
        destination: null,
        destinationPosition: null,
      },
      selectedNode: null,
      transformation: null,
    };
  },
  computed: {
    includedConnection() {
      return this.internalConnections
        .map((conn) => {
          let sourceNode = this.internalNodes.find(
            (node) => node.id == conn.source.id
          );
          if (!sourceNode) return null;

          let destNode = this.internalNodes.find(
            (node) => node.id == conn.destination.id
          );
          if (!destNode) return null;

          return {
            ...conn,
            source: {
              ...sourceNode,
              ...conn.source,
            },
            destination: {
              ...destNode,
              ...conn.destination,
            },
          };
        })
        .filter((conn) => conn != null);
    },
    connectionMarkers() {
      return this.internalConnections.filter((conn) => conn.markerEnd);
    },
  },
  mounted() {
    this.svg = d3.select("svg");
    var width = +this.svg.attr("width");
    var height = +this.svg.attr("height");

    var zoom = d3.zoom().on("zoom", this.zoomed);
    this.svg
      .on("mousedown", () => (this.selectedNode = null))
      .on("wheel", this.wheeled);
    // .call(zoom)
    // .on("dblclick.zoom", null)
    // .call(zoom.transform, d3.zoomIdentity);
  },
  methods: {
    addNode() {
      this.internalNodes.push({
        id: uuidv4(),
        x: 0,
        y: 0,
        width: 120,
        height: 50,
        name: "New",
        type: "start",
        shape: "rect",
      });
    },
    zoomed(e) {
      this.transformation = e.transform;
    },
    getRelativeCursorPosition(e) {
      let boundingClientRect = e.currentTarget.getBoundingClientRect();
      let actualX = e.pageX - boundingClientRect.left - window.scrollX;
      let actualY = e.pageY - boundingClientRect.top - window.scrollY;

      return { x: Math.trunc(actualX), y: Math.trunc(actualY) };
    },
    onConnecting(e, n, c) {
      this.connecting = true;
      this.connectingInfo.source = n;
      let pCursor = this.getRelativeCursorPosition(e);

      this.connectingInfo.sourcePosition = {
        x: c.x,
        y: c.y,
        side: "right",
      };
      this.connectingInfo.destinationPosition = {
        x: c.x,
        y: c.y,
      };
    },
    onConnected(_, n, c) {
      this.connecting = false;
      let existConnection = this.internalConnections.find(
        (conn) =>
          conn.source.id == this.connectingInfo.source.id &&
          conn.destination.id == n.id
      );
      if (existConnection) return;

      this.internalConnections.push({
        id: uuidv4(),
        source: {
          id: this.connectingInfo.source.id,
          position: this.connectingInfo.sourcePosition.side,
        },
        destination: { id: n.id, position: "left" },
        type: "bezier",
      });

      console.log(this.includedConnection);
    },
    onChartMouseMove(e) {
      if (!this.connecting) {
        this.$emit("chart-mousemove");
        return;
      }

      let pCursor = this.getRelativeCursorPosition(e);
      this.connectingInfo.destinationPosition = pCursor;
    },
    onChartMouseUp(_) {
      if (!this.connecting) {
        this.$emit("chart-mouseup");
        return;
      }

      this.connectingInfo = {
        source: null,
        sourcePosition: null,
        destination: null,
        destinationPosition: null,
      };
      this.connecting = false;
    },
  },
  props: {
    width: { type: [String, Number], default: "500px" },
    height: { type: [String, Number], default: "500px" },
    canvasWidth: { type: [String, Number], default: "1000px" },
    canvasHeight: { type: [String, Number], default: "1000px" },
  },
  watch: {
    selectedNode(n, o) {
      if (n) {
      }

      if (o) {
      }
    },
    // internalNodes: {
    //   deep: true,
    //   handler: function (n) {
    //     console.log("sa");
    //     this.renderNodes();
    //   },
    // },
  },
  components: {
    Background,
    Node,
    ConnectionLine,
    ConnectionWrapper,
    ConnectionMarkerRenderer,
  },
};
</script>

<style src="./index.css"></style>
