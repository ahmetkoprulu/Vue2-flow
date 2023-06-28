<template>
  <g :id="`${node.id}-resize-group`" v-show="visible">
    <!-- <rect
      :id="`${node.id}-resize-frame`"
      :x="node.x - 8"
      :y="node.y - 8"
      :width="node.width + 16"
      :height="node.height + 16"
      fill="transparent"
      stroke="#18A0FB"
      stroke-width="1px"
    /> -->
    <rect
      :id="`${node.id}-resize-frame-nw`"
      :x="node.x - 12"
      :y="node.y - 12"
      :width="8"
      :height="8"
      fill="white"
      stroke="#18A0FB"
      stroke-width="1px"
      class="node__resize__nwse"
    />
    <rect
      :id="`${node.id}-resize-frame-ne`"
      :x="node.x + node.width + 4"
      :y="node.y - 12"
      :width="8"
      :height="8"
      fill="white"
      stroke="#18A0FB"
      stroke-width="1px"
      class="node__resize__nesw"
    />
    <rect
      :id="`${node.id}-resize-frame-se`"
      :x="node.x + node.width + 4"
      :y="node.y + node.height + 4"
      :width="8"
      :height="8"
      fill="white"
      stroke="#18A0FB"
      stroke-width="1px"
      class="node__resize__nwse"
    />
    <rect
      :id="`${node.id}-resize-frame-sw`"
      :x="node.x - 12"
      :y="node.y + node.height + 4"
      :width="8"
      :height="8"
      fill="white"
      stroke="#18A0FB"
      stroke-width="1px"
      class="node__resize__nesw"
    />
  </g>
</template>

<script>
import * as d3 from "d3";

export default {
  data() {
    return {
      visible: false,
      resizeDirection: "",
    };
  },
  mounted() {
    var drag = d3
      .drag()
      .on("start", this.onResizeStart)
      .on("drag", this.onResize)
      .on("end", this.onResizeEnd);

    d3.select(`[id='${this.node.id}-resize-frame-nw'`).call(drag);
    d3.select(`[id='${this.node.id}-resize-frame-ne'`).call(drag);
    d3.select(`[id='${this.node.id}-resize-frame-sw'`).call(drag);
    d3.select(`[id='${this.node.id}-resize-frame-se'`).call(drag);
  },
  methods: {
    onResize(e) {
      if (this.resizeDirection == `${this.node.id}-resize-frame-nw`) {
        if (this.node.width - e.dx > this.minWidth) {
          this.node.x += e.dx;
          this.node.width -= e.dx;
        }
        if (this.node.height - e.dy > this.minHeight) {
          this.node.y += e.dy;
          this.node.height -= e.dy;
        }
      }
      if (this.resizeDirection == `${this.node.id}-resize-frame-ne`) {
        if (this.node.width + e.dx > this.minWidth) this.node.width += e.dx;
        if (this.node.height - e.dy > this.minHeight) {
          this.node.y += e.dy;
          this.node.height -= e.dy;
        }
      }
      if (this.resizeDirection == `${this.node.id}-resize-frame-sw`) {
        if (this.node.width - e.dx > this.minWidth) {
          this.node.x += e.dx;
          this.node.width -= e.dx;
        }
        if (this.node.height + e.dy > this.minHeight) this.node.height += e.dy;
      }
      if (this.resizeDirection == `${this.node.id}-resize-frame-se`) {
        if (this.node.width + e.dx > this.minWidth) this.node.width += e.dx;
        if (this.node.height + e.dy > this.minHeight) this.node.height += e.dy;
      }
    },
    onResizeStart(e) {
      this.resizeDirection = e.sourceEvent.srcElement.id;
    },
    onResizeEnd(e) {
      this.resizeDirection = "";
    },
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
  },
  props: {
    node: {
      type: Object,
    },
    minWidth: {
      type: Number,
      default: 50,
    },
    minHeight: {
      type: Number,
      default: 25,
    },
  },
};
</script>

<style></style>
