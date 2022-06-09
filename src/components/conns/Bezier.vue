<template>
  <path
    :id="`${conn.id}-line`"
    class="chart__connection-path"
    :d="path"
    :marker-end="`url(#${conn.id}-connection-marker)`"
  />
</template>
<script>
import { getBezierPath } from "@/utils/svg";

export default {
  name: "bezier",
  computed: {
    path() {
      return getBezierPath({
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
  },
};
</script>
