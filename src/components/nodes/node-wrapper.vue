<template>
  <g
    :id="node.id"
    class="node"
    @click="$emit('click', node)"
    @contextmenu.prevent="$emit('contextmenu', node)"
    @focus="onNodeFocus"
    @blur="onNodeFocusOut"
  >
    <!-- Resize Frame -->
    <ResizeFrame ref="resizeFrame" :node="node" />

    <g :id="`${node.id}-node`">
      <!-- Node -->
      <rect
        :id="`${node.id}-shape`"
        rx="5"
        ry="5"
        :x="node.x"
        :y="node.y"
        :width="node.width"
        :height="node.height"
        fill="white"
        stroke="black"
        stroke-width="1px"
      >
      </rect>

      <!-- Node Content -->
      <foreignObject
        :x="node.x + 5"
        :y="node.y + 5"
        :width="node.width - 10"
        :height="node.height - 10"
      >
        <span class="node__content">{{ node.name }}</span>
      </foreignObject>

      <!-- Connectors -->
      <circle
        v-if="connectors.left"
        v-show="isConnecting"
        :id="`${node.id}-connector-left`"
        :cx="connectors.left.x"
        :cy="connectors.left.y"
        r="4"
        class="connector"
        fill="black"
        stroke="white"
        :key="`${node.id}-connector-left`"
        @mouseover="onConnectorMouseOver"
        @mouseleave="onConnectorMouseLeave"
        @mouseup="(e) => onConnectorMouseUp(e, connectors.left)"
      />
      <circle
        v-if="connectors.right"
        v-show="!isConnecting"
        :id="`${node.id}-connector-right`"
        :cx="connectors.right.x"
        :cy="connectors.right.y"
        r="4"
        class="connector connector__hidden"
        fill="black"
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
  computed: {
    connectors() {
      const halfWidth = this.node.width / 2;
      const halfHeight = this.node.height / 2;
      // let top = { x: node.x + halfWidth, y: node.y - 10 };
      let left = { x: this.node.x, y: this.node.y + halfHeight };
      // let bottom = { x: node.x + halfWidth, y: node.y + node.height + 10 };
      let right = {
        x: this.node.x + this.node.width,
        y: this.node.y + halfHeight,
      };

      if (this.node.type == "input") return { right };
      else if (this.node.type == "output") return { left };

      return { left, right };
    },
  },
  mounted() {
    var drag = d3
      .drag()
      .on("start", this.onNodeDragStarted)
      .on("drag", this.onNodeDragged)
      .on("end", this.onNodeDragEnded);

    d3.select(`[id='${this.node.id}-node'`)
      //   .on("mouseup", this.nodeMouseDown)
      //   .on("dblclick", this.nodeDblClick)
      .call(drag);
  },
  methods: {
    onNodeFocus(e) {
      e.stopPropagation();
      this.$refs.resizeFrame.show();
    },
    onNodeFocusOut(e) {
      e.stopPropagation();
      this.$refs.resizeFrame.hide();
    },
    onConnectorMouseOver(e) {
      d3.select(e.srcElement).attr("r", 6);
    },
    onConnectorMouseLeave(e) {
      d3.select(e.srcElement).attr("r", 4);
    },
    onConnectorClick(e, c) {
      e.stopPropagation();
      e.preventDefault();
      this.$emit("connecting", e, this.node, c);
    },
    onConnectorMouseUp(e, c) {
      this.$emit("connected", e, this.node, c);
    },
    onNodeDragStarted(_) {},
    onNodeDragged(e) {
      if (this.connecting) return;
      this.node.x += e.dx;
      this.node.y += e.dy;
      // d3.select("[id='" + this.node.id + "']").attr(
      //   "transform",
      //   "translate(" + e.dx + "," + e.dy + ")"
      // );
    },
    onNodeDragEnded(e) {
      if (this.connecting) return;

      // d3.select("[id='" + d.id + "']").attr("stroke", null);
    },
  },
  watch: {},
  props: {
    node: {},
    isConnecting: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ResizeFrame,
  },
};
</script>

<style src="../index.css"></style>
