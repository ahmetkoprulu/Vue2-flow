<template>
  <g id="connection-line">
    <path
      id="line"
      class="chart__connection-line-path"
      :stroke="borderColor"
      :stroke-width="borderWidth"
      :d="path"
    />
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
      let param = {
        sourceX: this.info.sourcePosition.x,
        sourceY: this.info.sourcePosition.y,
        targetX: x,
        targetY: this.info.destinationPosition.y,
      };

      if (this.type == "bezier") return getBezierPath(param);

      if (this.type == "smoothstep") return getSmoothStepPath(param);

      if (this.type == "step") {
        param.borderRadius = 0;
        return getSmoothStepPath(param);
      }

      return getBezierPath(param);
    },
  },
  props: {
    info: {
      default: null,
    },
    type: { type: String },
    borderColor: { type: String },
    borderWidth: { type: String },
  },
};
</script>
