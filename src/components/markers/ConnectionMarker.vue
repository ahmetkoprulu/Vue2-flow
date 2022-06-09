<template>
  <marker
    :id="`${conn.id}-connection-marker`"
    class="chart__arrowhead"
    viewBox="-10 -10 20 20"
    refX="0"
    refY="0"
    :markerWidth="'12.5'"
    :markerHeight="'12.5'"
    :markerUnits="markerUnits"
    :orient="orient"
  >
    <polyline
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      :fill="color"
      points="-5,-4 0,0 -5,4 -5,-4"
      v-if="type === 'arrowclosed'"
    />
    <polyline
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      fill="none"
      points="-5,-4 0,0 -5,4"
      v-if="type === 'arrow'"
    />
  </marker>
</template>
<script>
export default {
  props: {
    conn: {
      required: true,
    },
    type: {
      default: true,
    },
    width: {
      default: "25",
    },
    height: {
      deafult: "25",
    },
    markerUnits: {
      default: "strokeWidth",
    },
    strokeWidth: {
      default: 1,
    },
    orient: {
      default: "auto",
    },
    color: {
      default: "#b1b1b7",
    },
  },
};
</script>
