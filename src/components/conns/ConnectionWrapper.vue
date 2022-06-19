<template>
  <g
    :id="conn.id"
    class="connection"
    :class="{
      selected: conn.selected,
      animated: conn.animated,
    }"
    @click="$emit('click', conn)"
    @focus="$emit('focus', conn)"
    @blur="$emit('blur', conn)"
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
