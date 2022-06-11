<template>
  <div class="chart__container">
    <svg
      id="chart"
      :width="width"
      :height="height"
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
          :is-connecting="connecting"
          @connecting="onConnecting"
          @connected="onConnected"
          @click="$emit('node-click', $event)"
          @contextmenu="$emit('node-contextmenu', $event)"
          v-for="n in nodes"
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
    <div class="chart__footer" :style="footerStyle">
      <slot name="footer" />
    </div>
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
      return this.connections
        .map((conn) => {
          let sourceNode = this.nodes.find((node) => node.id == conn.source.id);
          if (!sourceNode) return null;

          let destNode = this.nodes.find(
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
      return this.connections.filter((conn) => conn.markerEnd);
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
      this.nodes.push({
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
      let existConnection = this.connections.find(
        (conn) =>
          conn.source.id == this.connectingInfo.source.id &&
          conn.destination.id == n.id
      );
      if (existConnection) return;

      this.connections.push({
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
  watch: {
    selectedNode(n, o) {
      if (n) {
      }

      if (o) {
      }
    },
    // nodes: {
    //   deep: true,
    //   handler: function (n) {
    //     console.log("sa");
    //     this.renderNodes();
    //   },
    // },
  },
  props: {
    width: { type: [String, Number], default: "100%" },
    height: { type: [String, Number], default: "500px" },
    nodes: { type: Array, default: () => [] },
    connections: { type: Array, default: () => [] },
    canvasWidth: { type: [String, Number], default: "1000px" },
    canvasHeight: { type: [String, Number], default: "1000px" },
    footerStyle: { type: Object, default: () => {} },
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
