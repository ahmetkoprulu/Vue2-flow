<template>
  <path
    :id="`${conn.id}-line`"
    class="chart__connection-path"
    :d="path"
    :marker-end="`url(#${conn.markerEnd || ''})`"
  />
</template>
<script>
import { getSmoothStepPath } from "@/utils/svg";

export default {
  name: "step",
  computed: {
    path() {
      return getSmoothStepPath({
        sourceX: this.sourceX + 5,
        sourceY: this.sourceY,
        targetX: this.destX - 5,
        targetY: this.destY,
        borderRadius: 0,
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
  },
};
</script>
