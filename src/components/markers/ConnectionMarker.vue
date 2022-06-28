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
      :stroke="computedColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="computedStrokeWidth"
      :fill="computedColor"
      points="-5,-4 0,0 -5,4 -5,-4"
      v-if="type === 'arrowclosed'"
    />
    <polyline
      :stroke="computedColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="computedStrokeWidth"
      fill="none"
      points="-5,-4 0,0 -5,4"
      v-if="type === 'arrow'"
    />
  </marker>
</template>
<script>
export default {
  computed: {
    computedColor() {
      if (this.conn.style && this.conn.style.borderColor)
        return this.conn.style.borderColor;

      return this.color;
    },
    computedStrokeWidth() {
      if (this.conn.style && this.conn.style.borderWidth)
        return this.conn.style.borderWidth;

      return this.strokeWidth;
    },
  },
  props: {
    conn: {
      required: true,
    },
    type: {
      default: "",
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
      default: "2px",
    },
    orient: {
      default: "0deg",
    },
    color: {
      default: "#b1b1b7",
    },
  },
};
</script>
