<template>
  <path
    :id="`${conn.id}-line`"
    class="chart__connection-path"
    :d="path"
    :stroke="borderColor"
    :stroke-width="borderWidth"
    :marker-end="`url(#${conn.markerEnd || ''})`"
  />
</template>
<script>
import { getSmoothStepPath } from "@/utils/svg";

export default {
  name: "smoothstep",
  computed: {
    path() {
      return getSmoothStepPath({
        sourceX: this.sourceX + 5,
        sourceY: this.sourceY,
        targetX: this.destX - 5,
        targetY: this.destY,
      });
    },
  },
  props: {
    conn: {
      default: null,
    },
    sourceX: {},
    sourceY: {},
    destX: {},
    destY: {},
    borderColor: { type: String },
    borderWidth: { type: String },
  },
};
</script>
