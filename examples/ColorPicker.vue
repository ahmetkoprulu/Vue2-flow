<template>
  <span class="d-flex flex-column" @click="onClick">
    <font-awesome-icon :icon="icon" />
    <input
      :ref="`${name}-color-picker`"
      class="color-input"
      type="color"
      :value="value"
      @input="onChange"
    />
  </span>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: "#000000",
    },
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "fa-solid fa-palette",
    },
  },
  methods: {
    onClick() {
      let input = this.$refs[`${this.name}-color-picker`];
      input.click();
    },
    onChange(e) {
      this.$emit("input", e.target.value);
    },
  },
};
</script>
<style scoped>
.color-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 25px;
  height: 9px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  margin-top: 2px;
}

.color-input::-webkit-color-swatch {
  border: 1px solid rgba(43, 59, 74, 0.1);
  border-radius: 1px;
}
</style>
