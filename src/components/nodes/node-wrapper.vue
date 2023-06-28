<template>
  <g
    :id="node.id"
    class="node"
    @click="$emit('click', $event, node)"
    @contextmenu.prevent="$emit('contextmenu', $event, node)"
    @focus="onNodeFocus"
    @blur="onNodeBlur"
  >
    <!-- Resize Frame -->
    <ResizeFrame ref="resizeFrame" :node="node" />

    <g :id="`${node.id}-node`">
      <!-- Node -->
      <rect
        :id="`${node.id}-shape`"
        :x="node.x"
        :y="node.y"
        :width="node.width"
        :height="node.height"
        :fill="backgroundColor"
        :stroke="borderColor"
        :stroke-width="borderWidth"
      >
      </rect>

      <!-- Node Content -->
      <foreignObject
        :x="node.x + 5"
        :y="node.y + 5"
        :width="node.width - 10"
        :height="node.height - 10"
      >
        <span class="node__content" :style="{ color: color }">
          {{ node.name }}
        </span>
      </foreignObject>

      <!-- Connectors -->
      <circle
        v-if="connectors.left"
        v-show="shouldDisplayRecieverConnector"
        :id="`${node.id}-connector-left`"
        :cx="connectors.left.x"
        :cy="connectors.left.y"
        r="7"
        class="connector"
        fill="#18A0FB"
        opacity="0.7"
        stroke="white"
        :key="`${node.id}-connector-left`"
        @mouseover="onConnectorMouseOver"
        @mouseleave="onConnectorMouseLeave"
        @mouseup="(e) => onConnectorMouseUp(e, connectors.left)"
      />
      <circle
        v-if="connectors.right"
        v-show="!connectingInfo.source && showConnector"
        :id="`${node.id}-connector-right`"
        :cx="connectors.right.x"
        :cy="connectors.right.y"
        r="7"
        class="connector"
        style="position: absolute"
        fill="#18A0FB"
        opacity="0.7"
        stroke="white"
        :key="`${node.id}-connector-right`"
        @mouseover="onConnectorMouseOver"
        @mouseleave="onConnectorMouseLeave"
        @mousedown="(e) => onConnectorClick(e, connectors.right)"
        @mousemove="(e) => e.stopPropagation()"
      />
    </g>
  </g>
</template>
<script>
import * as d3 from "d3";
import ResizeFrame from "./reize-frame.vue";

export default {
  data() {
    return {
      showConnector: false,
    };
  },
  computed: {
    connectors() {
      const halfWidth = this.node.width / 2;
      const halfHeight = this.node.height / 2;
      // let top = { x: node.x + halfWidth, y: node.y - 10 };
      let left = { x: this.node.x - 20, y: this.node.y + halfHeight };
      // let bottom = { x: node.x + halfWidth, y: node.y + node.height + 10 };
      let right = {
        x: this.node.x + this.node.width + 20,
        y: this.node.y + halfHeight,
      };

      if (this.node.type == "input") return { right };
      else if (this.node.type == "output") return { left };

      return { left, right };
    },
    shouldDisplayRecieverConnector() {
      return (
        this.connectingInfo.source &&
        this.connectingInfo.source.id != this.node.id
      );
    },
    borderWidth() {
      if (!this.node.style || !this.node.style.borderWidth) return "1px";

      return this.node.style.borderWidth;
    },
    borderColor() {
      if (!this.node.style || !this.node.style.borderColor) return "black";

      return this.node.style.borderColor;
    },
    backgroundColor() {
      if (!this.node.style || !this.node.style.backgroundColor) return "white";

      return this.node.style.backgroundColor;
    },
    color() {
      if (!this.node.style || !this.node.style.color) return "black";

      return this.node.style.color;
    },
  },
  mounted() {
    var drag = d3
      .drag()
      .on("start", this.onNodeDragStarted)
      .on("drag", this.onNodeDragged)
      .on("end", this.onNodeDragEnded);

    d3.select(`[id='${this.node.id}-node'`).call(drag);
  },
  methods: {
    onNodeFocus(e) {
      e.stopPropagation();
      this.$refs.resizeFrame.show();
      this.showConnector = true;
      this.$emit("focus", e, this.node);
    },
    onNodeBlur(e) {
      e.stopPropagation();
      this.$refs.resizeFrame.hide();
      this.showConnector = false;
      this.$emit("blur", e, this.node);
    },
    onConnectorMouseOver(e) {
      d3.select(e.srcElement).attr("r", 10);
    },
    onConnectorMouseLeave(e) {
      d3.select(e.srcElement).attr("r", 7);
    },
    onConnectorClick(e, c) {
      e.stopPropagation();
      e.preventDefault();
      this.$emit("connecting", e, this.node, c);
    },
    onConnectorMouseUp(e, c) {
      this.$emit("connected", e, this.node, c);
    },
    onNodeDragStarted(e) {
      this.$emit("node-dragstart", this.node);
    },
    onNodeDragged(e) {
      if (this.connecting) return;
      this.node.x += e.dx;
      this.node.y += e.dy;
    },
    onNodeDragEnded(e) {
      if (this.connecting) return;
    },
  },
  watch: {},
  props: {
    node: {},
    connectingInfo: {
      type: Object,
    },
  },
  components: {
    ResizeFrame,
  },
};
</script>

<style src="../index.css"></style>
