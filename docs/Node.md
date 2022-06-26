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
