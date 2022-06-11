<template>
  <g id="connection-line">
    <path id="line" class="chart__connection-path" :d="path" />
  </g>
</template>
<script>
import { getBezierPath, getSmoothStepPath } from "@/utils/svg";

export default {
  computed: {
    path() {
      if (!this.info.destinationPosition) return;

      let x =
        this.info.destinationPosition.x > this.info.sourcePosition.x
          ? this.info.destinationPosition.x - 5
          : this.info.destinationPosition.x + 5;

      return getBezierPath({
        sourceX: this.info.sourcePosition.x,
        sourceY: this.info.sourcePosition.y,
        targetX: x,
        targetY: this.info.destinationPosition.y,
      });
    },
  },
  props: {
    info: {
      default: null,
    },
  },
};
</script>
