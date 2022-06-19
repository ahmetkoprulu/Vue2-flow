<template>
  <g
    :id="conn.id"
    class="chart__connection"
    :class="{
      animated: animated,
    }"
    @click.stop="$emit('click', conn)"
    @focus.stop="$emit('focus', conn)"
    @blur.stop="$emit('blur', conn)"
    @contextmenu.prevent="$emit('contextmenu', $event, conn)"
  >
    <component
      :is="conn.type"
      v-bind="{
        conn: conn,
        sourceX: sourceConnectorX,
        sourceY: sourceConnectorY,
        destX: destConnectorX,
        destY: destConnectorY,
        borderColor: borderColor,
        borderWidth: borderWidth,
      }"
    />
    <ConnectionText v-if="conn.text" />
  </g>
</template>
<script>
import Bezier from "./Bezier";
import Smoothstep from "./SmoothStep";
import Step from "./Step";
import ConnectionText from "./ConnectionText";

export default {
  computed: {
    sourceConnectorX() {
      return this.conn.source.x + this.conn.source.width;
    },
    sourceConnectorY() {
      return this.conn.source.y + this.conn.source.height / 2;
    },
    destConnectorX() {
      return this.conn.destination.x;
    },
    destConnectorY() {
      return this.conn.destination.y + this.conn.destination.height / 2;
    },
    borderColor() {
      if (!this.conn.style || !this.conn.style.borderColor) return "#b1b1b7";

      return this.conn.style.borderColor;
    },
    borderWidth() {
      if (!this.conn.style || !this.conn.style.borderWidth) return "2px";

      return this.conn.style.borderWidth;
    },
    animated() {
      if (!this.conn.style || !this.conn.style.animated) return false;

      return this.conn.style.animated;
    },
  },
  props: {
    conn: {
      default: null,
    },
  },
  components: {
    ConnectionText,
    Bezier,
    Smoothstep,
    Step,
  },
};
</script>

<style src="../index.css"></style>
