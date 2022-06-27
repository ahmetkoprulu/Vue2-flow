# Chart

Chart is the main component that renders nodes, connections, contextmenus, etc.

### Properties

| Property              | Description                           | Type                        | Default                                                                              |
| --------------------- | ------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------ |
| width                 | Width of the canvas                   | String                      | 100%                                                                                 |
| height                | Height of the canvas                  | String                      | 100%                                                                                 |
| nodes                 | Node objects to be rendered           | Array of node objects       | Empty Array                                                                          |
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
