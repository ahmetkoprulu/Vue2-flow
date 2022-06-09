<template>
  <g :id="node.id" class="node">
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
    <text
      class="chart__text"
      :x="textX"
      :y="textY"
      dominant-baseline="middle"
      text-anchor="middle"
    >
      {{ node.name }}
    </text>
    <circle
      :id="`${node.id}-connector-${c.side}`"
      :cx="c.x"
      :cy="c.y"
      r="4"
      class="connector"
      fill="black"
      stroke="white"
      v-for="c in connectors"
      :key="`${node.id}-connector-${c.side}`"
      @mouseover="onConnectorMouseOver"
      @mouseleave="onConnectorMouseLeave"
      @mousedown="(e) => onConnectorClick(e, c)"
      @mouseup="(e) => onConnectorMouseUp(e, c)"
    />
  </g>
</template>
<script>
import * as d3 from "d3";
export default {
  computed: {
    connectors() {
      const halfWidth = this.node.width / 2;
      const halfHeight = this.node.height / 2;
      // let top = { x: node.x + halfWidth, y: node.y - 10 };
      let left = { x: this.node.x, y: this.node.y + halfHeight, side: "left" };
      // let bottom = { x: node.x + halfWidth, y: node.y + node.height + 10 };
      let right = {
        x: this.node.x + this.node.width,
        y: this.node.y + halfHeight,
        side: "right",
      };

      if (this.node.type == "input") return [right];
      else if (this.node.type == "output") return [left];

      return [left, right];
    },
    textX() {
      return this.node.x + this.node.width / 2;
    },
    textY() {
      return this.node.y + this.node.height / 2;
    },
  },
  mounted() {
    var drag = d3
      .drag()
      .on("start", this.onNodeDragStarted)
      .on("drag", this.onNodeDragged)
      .on("end", this.onNodeDragEnded);

    d3.select(`[id='${this.node.id}'`)
      //   .on("mouseup", this.nodeMouseDown)
      //   .on("dblclick", this.nodeDblClick)
      .call(drag);
  },
  methods: {
    onConnectorMouseOver(e) {
      d3.select(e.srcElement).attr("r", 6);
    },
    onConnectorMouseLeave(e) {
      d3.select(e.srcElement).attr("r", 4);
    },
    onConnectorClick(e, c) {
      e.stopPropagation();
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
  watch: {
    transformation(transformation) {
      if (!transformation) return;
    },
  },
  props: {
    node: {},
    transformation: {
      default: null,
    },
    direction: {
      default: () => ["left", "right"],
    },
  },
};
</script>
