# Chart

Chart is the main component that renders nodes, connections, contextmenus, etc.

### Properties

| Property              | Description                           | Type                        | Default                                                                              |
| --------------------- | ------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------ |
| width                 | Width of the canvas                   | String                      | 100%                                                                                 |
| height                | Height of the canvas                  | String                      | 100%                                                                                 |
| nodes                 | Node objects to be rendered           | Array of node objects       | Array of one input and one output node                                               |
| connections           | Connection objects to be rendered     | Array of connection objects | Empty array                                                                          |
| transformation        | d3 zoom and pan object                | transformation object       | {k:1, x: 0, y: 0}                                                                    |
| connLineType          | Type of ghost connection line         | String                      | bezier                                                                               |
| connLineBorderWidth   | Thickness of ghost connection line    | String                      | 2px                                                                                  |
| connLineBorderColor   | Color of ghost connection line        | String                      | "#b1b1b7"                                                                            |
| footerStyle           | CSS style object for footer slot      | Object                      | Empty object                                                                         |
| enableNodeContextMenu | Enables node context menu             | Boolean                     | false                                                                                |
| nodeContextMenuX      | X position of node context menu       | Function(node)              | (node) => node.x - 115                                                               |
| nodeContextMenuY      | Y position of node context menu       | Function(node)              | (node) => node.y - 76                                                                |
| enableConnContextMenu | Enables connection context menu       | Boolean                     | false                                                                                |
| connContextMenuX      | X position of connection context menu | Function(conn)              | conn => conn.source.x + conn.source.width + (conn.destination.x - conn.source.x) / 2 |
| connContextMenuY      | Y position of connection context menu | Function(conn)              | (conn) => conn.source.y - 20,                                                        |

### API

| Method                    | Description                                       | parameters                                                                                          | Return                     |
| ------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------- |
| addNode                   | Adds new node                                     | id = undefined, name = "New Step", type = "io" x = 0, y = 0, width = 100, height = 50, style = null | void                       |
| removeNode                | Removes specified node                            | id                                                                                                  | void                       |
| removeConnsOfNode         | Removes all connections of specified node         | id (node)                                                                                           | void                       |
| getNodes                  | Returns list of nodes                             |                                                                                                     | Array of node objects      |
| getConnections            | Retrurns list of nodes                            |                                                                                                     | Array of connection object |
| getRelativeCursorPosition | Calculates mouse position in context of the chart |                                                                                                     | {x:number, y:number}       |

### Events

| Name                   | Description | Parameters |
| ---------------------- | ----------- | ---------- |
| chart-click            |             | $event     |
| node-click             |             | node       |
| node-click             |             | node       |
| node-contextmenu       |             | node       |
| node-focus             |             | node       |
| node-blur              |             | node       |
| connection-click       |             | conn       |
| connection-contextmenu |             | conn       |
| connection-focus       |             | conn       |
| connection-blur        |             | conn       |

### Slots

| Name            | Description                                                  | Props               |
| --------------- | ------------------------------------------------------------ | ------------------- |
| nodeContextmenu | Is displayed when node context menu event is triggered       | Selected node       |
| connContextmenu | Is displayed when connection context menu event is triggered | Selected connection |
| footer          |                                                              |                     |

# Node

Nodes are the shapes can be connected by each other. Example of complete node object is as follows.

```json
{
  id: 2,
  x: 782.453125,
  y: 188,
  width: 120,
  height: 50,
  name: "End",
  type: "output",
  shape: "rect",
  style: {
    backgroundColor:"lightcoral",
    color: "red",
    borderColor: "red",
    borderWidth: "3px",
  },
},
```

There are three type of nodes in **vue2 flow**. Those are input, output and io. The chart component will render node's connectors according to its type. For example, Input types cannot be connected by another nodes, they can only connect to other nodes. On the other hand, io type nodes can both connect and be connected.

**Shape property does not have any effect right now.**

# Connection

Connections are the lines between nodes and states that node at the start of connection is connected to the node at the end of connection. Example of complete connection object is as follows.

```json
{
  id:"357080f7-b3d3-4d4a-bfdd-0ddf642905",
  source: {
    id: 1,
    position: "right",
  },
  destination: {
    id:"d070e195-b70c-4635-b639-b62e1f5b1e",
    position: "left",
  },
  type: "bezier",
  style: {
    animated: true,
    borderWidth: "3px",
    borderColor: "#000"
  },
  markerEnd: "arrow",
  markerStart: "circle" // Future versions
},
```

Right now, **vue2 flow** support mono direction connection. The chart always flows left to right which means source position should alwasy be right and destination position should be left.

There are three type of connections in **vue2 flow** Which effects shape of the connection path.

# Ghost Connection

Ghost connection is the path rendered when node is started connecting to another one. It will be drawn betwen source node and mouse position till mouse up event is triggered.

Ghost connection related chart properties are as follows.
| Property | Description | Type | Default |
|-|-|-|-|
| connLineType | Type of ghost connection line | String | bezier |
| connLineBorderWidth | Thickness of ghost connection line | String | 2px |
| connLineBorderColor | Color of ghost connection line | String | "#b1b1b7" |
