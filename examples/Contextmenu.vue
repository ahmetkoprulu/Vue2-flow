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
          <font-awesome-icon style="margin-left: 6px" :icon="action.icon" />
          <span style="margin-left: 6px">{{ action.text }}</span>
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
          <font-awesome-icon style="margin-left: 6px" :icon="action.icon" />
          <span style="margin-left: 6px">{{ action.text }}</span>
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
<style scoped>
.chart__contextmenu__content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chart__contextmenu__wrapper {
  width: 200px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid rgb(0, 0, 0, 0.08);
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
}

.chart__contextmenu__content .chart__contextmenu__item {
  list-style: none;
  font-size: 0.8rem;
  height: 35px;
  display: flex;
  width: 100%;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 2px;
}

.chart__contextmenu__content .chart__contextmenu__item:hover {
  background: #f2f2f2;
}

.chart__contextmenu__content .chart__contextmenu__division {
  display: flex;
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid #ccc;
}

.chart__contextmenu__division .chart__contextmenu__item:last-child {
  margin-bottom: 0;
}

.chart__contextmenu__content .chart__contextmenu__sub {
  position: relative;
  justify-content: space-between;
}

.chart__contextmenu__sub .chart__contextmenu__sub-menu {
  position: absolute;
  background: #fff;
  width: 200px;
  right: -200px;
  top: -35px;
  padding: 13px;
  opacity: 0;
  pointer-events: none;
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.08);
  transition: 0.2s ease;
}

.chart__contextmenu__sub:hover .chart__contextmenu__sub-menu {
  opacity: 1;
  pointer-events: auto;
}

.chart__contextmenu__content .disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
