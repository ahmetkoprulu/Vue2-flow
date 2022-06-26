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
