<template>
  <div>
    <div class="custom-select" @click="onToggle">
      <span class="selected-option">
        <span class="mr-auto">
          <font-awesome-icon :icon="selected.icon" v-if="selected.icon" />
          <span class="option-text" v-if="selected.text">{{
            selected.text
          }}</span>
        </span>
        <span class="ml-2 mt-1">
          <font-awesome-icon icon="fa-solid fa-angle-down fa-fw" />
        </span>
      </span>
      <ul class="options mt-2" :style="{ display: display }">
        <li
          v-for="option in options"
          :key="option.value"
          @click="onSelected(option)"
        >
          <font-awesome-icon :icon="option.icon" v-if="option.icon" />
          <span class="option-text" v-if="option.text">{{ option.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      display: "none",
      selected: 1,
    };
  },
  mounted() {
    this.selected = this.options.find((option) => option.value === this.value);
  },
  methods: {
    onToggle() {
      this.display = this.display === "none" ? "block" : "none";
    },
    onSelected(option) {
      this.selected = option;
      this.display = "none";
      this.$emit("input", option.value);
      this.onToggle();
    },
  },
};
</script>
<style scoped>
.custom-select {
  position: relative;
}

.custom-select .selected-option {
  display: flex;
  align-items: center;
  padding: 1px 6px;
  border: 1px solid rgba(43, 59, 74, 0.4);
  border-radius: 4px;
  cursor: pointer;
}

.mr-auto {
  margin-right: auto;
}

.ml-2 {
  margin-left: 6px;
}

.mt-1 {
  margin-top: 1px;
}

.custom-select .options {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 999;
  display: none;
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #fff;
  border: 1px solid rgba(43, 59, 74, 0.4);
  border-radius: 4px;
  min-width: 100%;
}

.custom-select .options li {
  padding: 5px;
  cursor: pointer;
}

.custom-select .options li:hover {
  background-color: #f5f5f5;
}
</style>
