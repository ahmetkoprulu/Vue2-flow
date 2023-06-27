<template>
  <div
    class="chart__contextmenu__wrapper"
    @contextmenu.prevent.stop=""
    @mouseup.stop=""
    @mousedown.stop=""
    @mousemove.stop=""
  >
    <div class="chart__contextmenu__content">
      <ul class="chart__contextmenu__menu prevent-select">
        <li
          v-for="action in undividedActions"
          :key="action.text"
          class="chart__contextmenu__item"
          :class="{ disabled: action.disabled && action.disabled() }"
          :style="action.style"
          @click.stop="executeAction(action)"
        >
          <i class="ml-2" :class="action.icon"></i>
          <span class="ml-2">{{ action.text }}</span>
        </li>
      </ul>
      <div class="chart__contextmenu__division prevent-select" v-if="isDivided">
        <li
          v-for="action in dividedActions"
          :key="action.text"
          class="chart__contextmenu__item"
          :class="{ disabled: action.disabled && action.disabled() }"
          :style="action.style"
          @click.prevent.stop="executeAction(action)"
        >
          <i class="ml-2" :class="action.icon"></i>
          <span class="ml-2">{{ action.text }}</span>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actions: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    isDivided() {
      return this.actions.some((action) => action.divided);
    },
    dividedActions() {
      return this.actions.filter((action) => action.divided);
    },
    undividedActions() {
      return this.actions.filter((action) => !action.divided);
    },
  },
  methods: {
    executeAction(action) {
      if (action.disabled && action.disabled()) return;

      if (!action.event) return;

      action.event();
      this.$emit("action-executed", action);
    },
  },
};
</script>
