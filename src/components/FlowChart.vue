<template>
  <div class="chart__container">
    <svg
      class="chart__self"
      :width="width"
      :height="height"
      @mousemove="onChartMouseMove"
      @mouseup="onChartMouseUp"
      @contextmenu.prevent="$emit('chart-contextmenu', $event)"
      @click="$emit('chart-click', $event)"
    >
      <Background
        :width="960"
        :height="500"
        :transformation="d3Transformation"
      />
      <g id="connections">
        <ConnectionMarkerRenderer :connections="connectionMarkers" />
        <ConnectionWrapper
          :conn="conn"
          :line="conn.line"
          :type="conn.type"
          @click="$emit('connection-click', conn)"
          @contextmenu.stop="onConnContextMenu($event, conn)"
          @focus="onConnFocus"
          @blur="onConnBlur"
          v-for="conn in includedConnection"
          :key="conn.id"
        />
      </g>
      <ConnectionLine
        :info="connectingInfo"
        :type="connLineType"
        :borderColor="connLineBorderColor"
        :borderWidth="connLineBorderWidth"
      />
      <g id="nodes">
        <Node
          :node="n"
          :transformation="d3Transformation"
          :connecting-info="connectingInfo"
          @connecting="onConnecting"
          @connected="onConnected"
          @click.stop="onNodeClick"
          @contextmenu.stop="onNodeContextMenu"
          @focus="onNodeFocus"
          @blur="onNodeBlur"
          @node-dragstart="onNodeDragStart"
          v-for="n in nodes"
          :key="n.id"
        />
      </g>
      <g
        id="chart-contextmenu"
        ref="chartContextmenu"
        @click.stop=""
        v-show="enableContextMenu"
      >
        <foreignObject
          :x="contextmenuPosition.x"
          :y="contextmenuPosition.y"
          v-if="showContextMenu"
          class="chart__contextmenu"
          width="1"
          height="1"
        >
          <slot
            name="contextmenu"
            :target="contextmenuTarget"
            :position="contextmenuPosition"
            :hide-contextmenu="hideContextmenu"
          />
        </foreignObject>
      </g>

      <g
        id="chart-options"
        ref="chart-options"
        @click.stop=""
        v-show="enableOptions"
      >
        <foreignObject
          style="overflow: visible"
          :x="optionsPosition.x"
          :y="optionsPosition.y"
          v-if="showOptions"
          width="1"
          height="1"
        >
          <slot
            name="options"
            :target="optionsTarget"
            :position="optionsPosition"
            :element="optionsElement"
          />
        </foreignObject>
      </g>
    </svg>
    <div></div>
    <div class="chart__footer" :style="footerStyle">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { uuidv4 } from "../utils/math";

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
      d3Transformation: null,
      showContextMenu: false,
      contextmenuPosition: { x: 0, y: 0 },
      contextmenuTarget: null,
      showOptions: false,
      optionsPosition: { x: 0, y: 0 },
      optionsElement: null,
      optionsTarget: null,
    };
  },
  computed: {
    includedConnection() {
      return this.connections
        .map((conn) => {
          if (!conn.markerEnd) conn.markerEnd = null;

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
    this.svg = d3.select(".chart__self");

    var zoom = d3.zoom().on("zoom", this.onZoomed);
    this.zoom = zoom;
    this.svg
      .on("click", (e) => {
        this.showContextMenu = false;
        this.showOptions = false;
        this.$set(this, "selectedNode", null);
        this.$set(this, "selectedConnection", null);
      })
      .on("contextmenu", this.onChartContextMenu)
      .on("wheel", this.wheeled);

    this.d3Transformation = d3.zoomIdentity
      .translate(this.transformation.x, this.transformation.y)
      .scale(this.transformation.k);

    this.svg.call(zoom).call(zoom.transform, this.d3Transformation);
  },
  methods: {
    zoomIn() {
      this.svg.call(this.zoom.scaleBy, 1.2);
    },
    zoomOut() {
      this.svg.call(this.zoom.scaleBy, 0.8);
    },
    fitToNodes() {
      let g = d3.select("#nodes");
      let bounds = g.node().getBBox();
      const svg = this.svg.node();

      const scale =
        Math.min(
          svg.clientWidth / bounds.width,
          svg.clientHeight / bounds.height
        ) - 0.5;
      const x = -(bounds.x + bounds.width / 2) * scale + svg.clientWidth / 2;
      const y = -(bounds.y + bounds.height / 2) * scale + svg.clientHeight / 2;

      this.transformation.x = x;
      this.transformation.y = y;
      this.transformation.k = scale;

      this.svg.call(
        this.zoom.transform,
        d3.zoomIdentity.translate(x, y).scale(scale)
      );
    },
    addNode(node, toContextPosition = false) {
      if (!node) return;
      if (!node.id) node.id = uuidv4();
      if (!node.name) node.name = "New Step";

      node.type = "io";

      if (!node.width || !node.height) {
        node.width = 120;
        node.height = 60;
      }

      if (toContextPosition) {
        const pos = this.contextmenuPosition;
        node.x = pos.x - node.width / 2;
        node.y = pos.y - node.height / 2;
      }

      this.nodes.push(node);
    },
    deleteNode(id) {
      this.removeConnsOfNode(id);
      const i = this.nodes.findIndex((x) => x.id == id);
      this.nodes.splice(i, 1);
      this.showOptions = false;
      this.$set(this, "selectedNode", null);
    },
    removeConnsOfNode(id) {
      this.connections
        .filter((x) => x.source.id == id || x.destination.id == id)
        .map((x) => x.id)
        .forEach((x) => this.removeConn(x));
    },
    removeConn(id) {
      const i = this.connections.findIndex((x) => x.id == id);
      this.connections.splice(i, 1);
      this.selectedConnection = null;
      this.showOptions = false;
    },
    getNodes() {
      return this.nodes;
    },
    getConnections() {
      return this.connections;
    },
    getRelativeCursorPosition(e) {
      let boundingClientRect = e.currentTarget.getBoundingClientRect();
      let actualX = e.pageX - boundingClientRect.left - window.scrollX;
      let actualY = e.pageY - boundingClientRect.top - window.scrollY;
      var x = (actualX - this.transformation.x) / this.transformation.k;
      var y = (actualY - this.transformation.y) / this.transformation.k;

      return { x: Math.trunc(x), y: Math.trunc(y) };
    },
    // Chart Events
    onZoomed(e) {
      this.showContextMenu = false;
      this.d3Transformation = e.transform;
      this.transformation.k = e.transform.k;
      this.transformation.x = e.transform.x;
      this.transformation.y = e.transform.y;

      d3.select("g#nodes").attr("transform", e.transform);
      d3.select("g#connections").attr("transform", e.transform);
      d3.select("g#connection-line").attr("transform", e.transform);
      d3.select("g#node-contextmenu").attr("transform", e.transform);
      d3.select("g#connection-contextmenu").attr("transform", e.transform);
      d3.select("g#chart-options").attr("transform", e.transform);
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
        type: this.connLineType,
        line: "solid",
        style: {
          borderColor: this.connLineBorderColor,
          borderWidth: this.connLineBorderWidth,
        },
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
    onChartContextMenu(e) {
      this.displayContextMenu(e, "chart");
      this.$emit("chart-contextmenu");
    },
    // Node Events
    onNodeFocus(e, node) {
      this.showOptions = false;
      this.$set(this, "selectedNode", node);
      this.$set(this, "selectedConnection", null);
      this.displayOptions(node, "node");
      this.$emit("node-focus", node);
    },
    onNodeBlur(node) {
      this.$emit("node-blur", node);
    },
    onNodeDragStart(node) {
      this.showContextMenu = false;
      this.$emit("node-dragstart", node);
    },
    onNodeClick(e, node) {
      this.showContextMenu = false;
      this.$emit("node-click", node);
    },
    onNodeContextMenu(e, node) {
      this.displayContextMenu(e, "node");
      this.$set(this, "selectedNode", node);
      this.$set(this, "selectedConnection", null);
      this.$emit("node-contextmenu", node);
    },
    // Connection Events
    onConnFocus(conn) {
      this.showOptions = false;
      this.$set(this, "selectedNode", null);
      this.$set(this, "selectedConnection", conn);
      this.displayOptions(conn, "connection");
      this.$emit("connection-focus", conn);
    },
    onConnBlur(conn) {
      this.$emit("connection-blur", conn);
    },
    onConnContextMenu(e, conn) {
      this.displayContextMenu(e, "connection");
      this.selectedConnection = conn;
      this.selectedNode = null;
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
    displayContextMenu(e, type) {
      var [x, y] = d3.pointer(e, this.svg.node());

      this.contextmenuPosition = { x: x, y: y };
      this.contextmenuTarget = type;
      this.showContextMenu = true;
    },
    hideContextmenu() {
      this.showContextMenu = false;
    },
    displayOptions(e, type) {
      this.optionsTarget = type;
      this.optionsElement = e;
      this.showOptions = true;
    },
  },
  watch: {
    optionsElement: {
      deep: true,
      handler(val) {
        if (!val) {
          this.optionsPosition = {
            x: 0,
            y: 0,
          };
        }

        if (this.optionsTarget == "node") {
          this.optionsPosition = { x: val.x + val.width / 2, y: val.y };
        } else if (this.optionsTarget == "connection") {
          let startX = val.source.x + val.source.width;
          let endX = val.destination.x;
          let positionX = (startX + endX) / 2;
          let positionY = Math.min(val.source.y, val.destination.y);

          this.optionsPosition = {
            x: positionX,
            y: positionY,
          };
        }
      },
    },
  },
  props: {
    width: { type: [String, Number], default: "100%" },
    height: { type: [String, Number], default: "500px" },
    nodes: { type: Array, default: () => [] },
    connections: { type: Array, default: () => [] },
    transformation: {
      type: Object,
      default() {
        return { k: 1, x: 0, y: 0 };
      },
    },
    connLineType: { type: String, default: "bezier" },
    connLineBorderWidth: { type: String, default: "2px" },
    connLineBorderColor: { type: String, default: "#b1b1b7" },
    footerStyle: { type: Object, default: () => {} },
    enableContextMenu: { type: Boolean, default: true },
    enableOptions: { type: Boolean, default: true },
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
