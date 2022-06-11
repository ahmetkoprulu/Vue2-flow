<template>
  <svg class="chart__background">
    <pattern
      id="background-pattern"
      :x="xOffSet"
      :y="yOffSet"
      :width="scaledGap"
      :height="scaledGap"
      patternUnits="userSpaceOnUse"
    >
      <template v-if="variant === 'lines'">
        <path stroke="black" :stroke-width="size" :d="d" />
      </template>
      <template v-else>
        <circle :cx="size" :cy="size" :r="size" fill="#81818a" />
      </template>
    </pattern>
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      :fill="`url(#background-pattern)`"
    />
    <slot></slot>
  </svg>
</template>

<script>
import * as d3 from "d3";

export default {
  data() {
    return {
      scaledGap: 10,
      xOffSet: 10,
      yOffSet: 10,
      size: 0.4,
      d: `M${5} 0 V${10} M0 ${5} H${10}`,
    };
  },
  mounted() {},
  watch: {
    transformation(transformation) {
      if (!transformation) return;

      this.scaledGap = 20 * transformation.k;

      if (this.variant == "lines") {
        this.d = `M${this.scaledGap / 2} 0 V${this.scaledGap} M0 ${
          this.scaledGap / 2
        } H${this.scaledGap}`;

        return;
      }

      this.xOffSet = transformation.x % this.scaledGap;
      this.yOffSet = transformation.y % this.scaledGap;
      this.size = 0.4 * transformation.k;
    },
  },
  computed: {},
  props: {
    width: {
      type: [String, Number],
    },
    height: {
      type: [String, Number],
    },
    variant: {
      type: String,
      default: "dots",
    },
    transformation: {
      type: Object,
    },
  },
};
</script>
