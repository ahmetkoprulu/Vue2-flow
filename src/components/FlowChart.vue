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
      <g id="connections">
        <ConnectionMarkerRenderer :connections="connectionMarkers" />
        <ConnectionWrapper
          :conn="conn"
          @click.stop="$emit('connection-click', $event)"
          @contextmenu.stop="onConnContextMenu"
          @focus="onConnFocus"
          @blur="onConnBlur"
          v-for="conn in includedConnection"
          :key="conn.id"
        />
      </g>

      <g id="nodes">
        <Node
          :node="n"
          :transformation="transformation"
          :connecting-info="connectingInfo"
          @connecting="onConnecting"
          @connected="onConnected"
          @click.stop="$emit('node-click', $event)"
          @contextmenu.stop="onNodeContextMenu"
          @focus="onNodeFocus"
          @blur="onNodeBlur"
          @node-dragstart="onNodeDragStart"
          v-for="n in nodes"
          :key="n.id"
        />
      </g>
      <ConnectionLine :info="connectingInfo" v-show="connecting" />
      <g
        id="node-contextmenu"
        @click.stop=""
        v-show="enableNodeContextMenu && selectedNode && showNodeContextMenu"
      >
        <foreignObject
          :x="nodeContextMenuPosition.x"
          :y="nodeContextMenuPosition.y"
          v-if="enableNodeContextMenu && selectedNode && showNodeContextMenu"
          class="node__contextmenu"
          width="1"
          height="1"
        >
          <slot name="nodeContextmenu" />
        </foreignObject>
      </g>
      <g
        id="connection-contextmenu"
        @click.stop=""
        v-show="
          enableConnContextMenu && selectedConnection && showConnContextMenu
        "
      >
        <foreignObject
          :x="connContextMenuPosition.x"
          :y="connContextMenuPosition.y"
          v-if="
            enableConnContextMenu && selectedConnection && showConnContextMenu
          "
          class="connection__contextmenu"
          width="1"
          height="1"
        >
          <slot name="connContextmenu" />
        </foreignObject>
      </g>
    </svg>
    <div></div>
    <!-- <div id="chart-contextmenu" class="chart__contextmenu">
      <slot name="contextmenu" />
    </div> -->
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
      selectedConnection: null,
      showNodeContextMenu: false,
      showConnContextMenu: false,
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
    nodeContextMenuPosition() {
      if (!this.enableNodeContextMenu) return { x: 0, y: 0 };
      if (!this.selectedNode) return { x: 0, y: 0 };

      return {
        x: this.nodeContextMenuX(this.selectedNode),
        y: this.nodeContextMenuY(this.selectedNode),
      };
    },
    connContextMenuPosition() {
      if (!this.enableConnContextMenu) return { x: 0, y: 0 };
      if (!this.selectedConnection) return { x: 0, y: 0 };

      return {
        x: this.connContextMenuX(this.selectedConnection),
        y: this.connContextMenuY(this.selectedConnection),
      };
    },
  },
  mounted() {
    this.svg = d3.select("svg");

    var zoom = d3.zoom().on("zoom", this.onZoomed);
    this.svg
      .on("click", () => {
        this.selectedNode = null;
        this.showNodeContextMenu = false;
        this.selectedConnection = null;
        this.showNodeContextMenu = false;
      })
      .on("wheel", this.wheeled);

    this.svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
  },
  methods: {
    addNode({
      id = undefined,
      name = "New Step",
      type = "step",
      x = 0,
      y = 0,
    }) {
      if (!id) id = uuidv4();

      // Stroke: #D1D5DB
      // Bg Color: #FFF
      // Color: #000
      // width: 120,
      // height: 50,
      // shape: "rect"

      this.nodes.push({
        id: id,
        name: name,
        type: type,
        x: x,
        y: y,
      });
    },
    onZoomed(e) {
      this.transformation = e.transform;
      d3.select("g#nodes").attr("transform", e.transform);
      d3.select("g#connections").attr("transform", e.transform);
      d3.select("g#connection-line").attr("transform", e.transform);
      d3.select("g#node-contextmenu").attr("transform", e.transform);
      d3.select("g#connection-contextmenu").attr("transform", e.transform);
    },
    getRelativeCursorPosition(e) {
      let boundingClientRect = e.currentTarget.getBoundingClientRect();
      let actualX = e.pageX - boundingClientRect.left - window.scrollX;
      let actualY = e.pageY - boundingClientRect.top - window.scrollY;
      var x = (actualX - this.transformation.x) / this.transformation.k;
      var y = (actualY - this.transformation.y) / this.transformation.k;

      return { x: Math.trunc(x), y: Math.trunc(y) };
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
      if (existConnection) {
        this.resetConnectingInfo();
        return;
      }

      // if (!this.validateConn && !this.validateConn(this.connectingInfo)) {
      //   this.resetConnectingInfo();
      //   return;
      // }

      this.connections.push({
        id: uuidv4(),
        source: {
          id: this.connectingInfo.source.id,
          position: this.connectingInfo.sourcePosition.side,
        },
        destination: { id: n.id, position: "left" },
        type: "bezier",
      });

      this.resetConnectingInfo();
    },
    onChartMouseMove(e) {
      if (!this.connecting) {
        // this.$emit("chart-mousemove");
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
      this.resetConnectingInfo();
      this.connecting = false;
    },
    onNodeFocus(node) {
      this.selectedNode = node;
      this.showNodeContextMenu = false;
      this.$emit("node-focus", node);
    },
    onNodeBlur(node) {
      this.$emit("node-blur", node);
    },
    onNodeDragStart(node) {
      this.showNodeContextMenu = false;
      this.$emit("node-dragstart", node);
    },
    onNodeContextMenu(e, node) {
      this.showNodeContextMenu = true;
      this.selectedNode = node;
      console.log(this.showNodeContextMenu, this.selectedNode);
      this.$emit("node-contextmenu", node);
    },
    onConnFocus(conn) {
      this.selectedConnection = conn;
      this.showNodeContextMenu = false;
      this.$emit("connection-focus", conn);
    },
    onConnBlur(conn) {
      this.showConnContextMenu = false;
      this.selectedConnection = null;

      this.$emit("connection-blur", conn);
    },
    onConnContextMenu(conn) {
      this.showConnContextMenu = true;
      console.log(this.selectedConnection, this.showConnContextMenu);
      this.$emit("connection-contextmenu", conn);
    },
    generateId() {
      return uuidv4();
    },
    resetConnectingInfo() {
      this.connectingInfo = {
        source: null,
        sourcePosition: null,
        destination: null,
        destinationPosition: null,
      };
    },
  },
  props: {
    width: { type: [String, Number], default: "100%" },
    height: { type: [String, Number], default: "500px" },
    nodes: {
      type: Array,
      default: () => [
        {
          id: 1,
          name: "Start",
          type: "start",
          x: 100,
          y: 100,
        },
        {
          id: 2,
          name: "End",
          type: "end",
          x: 100,
          y: 400,
        },
      ],
    },
    connections: { type: Array, default: () => [] },
    canvasWidth: { type: [String, Number], default: "1000px" },
    canvasHeight: { type: [String, Number], default: "1000px" },
    footerStyle: { type: Object, default: () => {} },
    enableNodeContextMenu: { type: Boolean, default: false },
    nodeContextMenuX: {
      type: Function,
      default: (node) => node.x,
    },
    nodeContextMenuY: {
      type: Function,
      default: (node) => node.y - 76,
    },
    enableConnContextMenu: { type: Boolean, default: false },
    connContextMenuX: {
      type: Function,
      default: (conn) => {
        console.log(conn.source.x + (conn.destination.x - conn.source.x) / 2);
        return (
          conn.source.x +
          conn.source.width +
          (conn.destination.x - conn.source.x) / 2
        );
      },
    },
    connContextMenuY: {
      type: Function,
      default: (conn) => conn.source.y - 20,
    },
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
