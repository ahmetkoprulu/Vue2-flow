<template>
  <defs>
    <ConnectionMarker
      :conn="conn"
      :type="conn.markerEnd"
      v-for="conn in connections"
      :key="`${conn.id}-connection-marker`"
    />
  </defs>
</template>
<script>
import ConnectionMarker from "./ConnectionMarker.vue";

export default {
  props: {
    connections: {
      required: true,
    },
  },
  components: {
    ConnectionMarker,
  },
};
</script>
