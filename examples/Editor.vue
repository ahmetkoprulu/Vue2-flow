<template>
  <div class="container">
    <Chart
      ref="chart"
      :nodes="nodes"
      :connections="connections"
      connLineType="bezier"
      :node-contextmenu-actions="nodeActions"
      :chart-contextmenu-actions="chartActions"
      :connection-contextmenu-actions="connectionActions"
      @node-click="selectNode"
      @node-focus="selectNode"
      @node-contextmenu="selectNode"
      @connection-click="selectConnection"
      @connection-contextmenu="selectConnection"
    >
      <template #contextmenu="{ target }">
        <ChartContextmenu
          :actions="chartActions"
          @action-executed="$refs.chart.hideContextmenu"
          v-if="target === 'chart'"
        />
        <ChartContextmenu
          :actions="nodeActions"
          @action-executed="$refs.chart.hideContextmenu"
          v-else-if="target === 'node'"
        />
        <ChartContextmenu
          :actions="connectionActions"
          @action-executed="$refs.chart.hideContextmenu"
          v-else-if="target === 'connection'"
        />
      </template>
      <div class="toolbar" slot="footer">
        <div
          class="context__button prevent-select"
          @click="addNode(false, false)"
        >
          <font-awesome-icon icon="fa-solid fa-plus fa-fw" />
        </div>
        <div class="context__button prevent-select" @click="cloneNode">
          <font-awesome-icon icon="fa-solid fa-clone fa-fw" />
        </div>
        <div class="v-divider" />
        <div class="context__button prevent-select" @click="fitToNodes">
          <font-awesome-icon icon="fa-solid fa-crop-simple fa-fw" />
        </div>
        <div class="context__button prevent-select" @click="zoomIn">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass-plus fa-fw" />
        </div>
        <div class="context__button prevent-select" @click="zoomOut">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass-minus fa-fw" />
        </div>
        <div class="v-divider" />
        <div class="context__button prevent-select" @click="deleteNode">
          <font-awesome-icon icon="fa-solid fa-trash fa-fw" />
        </div>
      </div>
    </Chart>
  </div>
</template>

<script>
import Chart from "@/components/FlowChart.vue";
import ChartContextmenu from "./Contextmenu.vue";
import nodes from "./nodes.json";
import connections from "./connections.json";

export default {
  name: "App",
  data() {
    return {
      nodes: [],
      connections: [],
      copiedNode: null,
      selectedNode: null,
      selectedConn: null,
      chartActions: [
        {
          text: "Add New Step",
          icon: "far fa-fw fa-plus",
          event: () => this.addNode(),
        },
        {
          text: "Paste",
          icon: "far fa-fw fa-paste",
          event: () => this.addNode(true),
          disabled: () => this.copiedNode == null,
        },
      ],
      nodeActions: [
        {
          text: "Copy",
          icon: "far fa-fw fa-copy",
          event: () => this.copyNode(),
          disabled: () => !this.isSelectedNodeIO,
        },
        {
          text: "Delete",
          icon: "far fa-fw fa-trash",
          style: {
            color: "red",
          },
          divided: true,
          event: () => this.deleteNode(),
          disabled: () => !this.isSelectedNodeIO,
        },
      ],
      connectionActions: [
        {
          text: "Delete",
          icon: "far fa-fw fa-trash",
          style: {
            color: "red",
          },
          event: () => this.deleteConnection(),
        },
      ],
    };
  },
  computed: {
    isNodeSelected() {
      return this.selectedNode != null;
    },
    isSelectedNodeIO() {
      return (
        this.selectedNode != null &&
        this.selectedNode.id != 1 &&
        this.selectedNode.id != 2
      );
    },
  },
  mounted() {
    this.nodes = nodes;
    this.connections = connections;
  },
  methods: {
    addNode(paste = false, toCursorPosition = true) {
      if (!this.copiedNode && paste) return;

      if (paste) {
        this.$refs.chart.addNode(this.copiedNode, toCursorPosition);
        this.copiedNode = null;

        return;
      }

      this.selectedNode = null;
      this.$refs.chart.addNode(
        {
          id: this.$refs.chart.generateId(),
          x: 10,
          y: 10,
          name: "New",
          type: "io",
        },
        toCursorPosition
      );
    },

    cloneNode() {
      if (!this.isNodeSelected) return;

      this.copiedNode = { ...this.selectedNode };
      this.copiedNode.id = this.$refs.chart.generateId();
      this.copiedNode.x += 10;
      this.copiedNode.y += 10;
      this.addNode(true, false);
    },

    deleteNode() {
      if (!this.isNodeSelected && !this.selectedConn) return;

      this.$refs.chart.deleteNode(this.selectedNode.id);
      this.selectedNode = null;
    },

    copyNode() {
      this.copiedNode = { ...this.selectedNode };
      this.copiedNode.id = this.$refs.chart.generateId();
    },

    fitToNodes() {
      this.$refs.chart.fitToNodes();
    },

    zoomIn() {
      this.$refs.chart.zoomIn();
    },

    zoomOut() {
      this.$refs.chart.zoomOut();
    },

    selectNode(node) {
      if (node.type == "input" || node.type == "output") {
        this.selectedNode = null;
        return;
      }

      this.selectedNode = node;
      this.$emit("update");
    },

    selectConnection(conn) {
      this.selectedConn = conn;
    },

    deleteConnection() {
      if (!this.selectedConn) return;

      this.$refs.chart.removeConn(this.selectedConn.id);
      this.selectedConn = null;
    },
  },
  components: {
    Chart,
    ChartContextmenu,
  },
};
</script>

<style>
.container {
  margin: auto;
  width: 100%;
  background-color: #fff;
  border: 1px solid #e6e9ed;
}

.toolbar {
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid rgb(0, 0, 0, 0.08);
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  margin-bottom: 10px;
  padding: 4px;
}

.toolbar .context__button {
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  gap: 10px;
  height: 100%;
  background: #ffffff;
  color: #9ca3af;
  flex: none;
  align-self: stretch;
}

.toolbar .context__button:hover {
  background: #f2f2f2;
  color: #333;
}

.v-divider {
  margin-left: 4px;
  margin-right: 4px;
  background: #ccc;
  width: 1px;
  height: 50%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
}
</style>
