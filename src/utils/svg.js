import { approximatelyEquals } from './math';
import * as d3 from "d3";

const LeftOrRight = ["left", "right"]

function lineTo(g, x1, y1, x2, y2, lineWidth, strokeStyle, dash) {
  let sta = [x1, y1];
  let end = [x2, y2];
  let path = g.append('path').
    attr('stroke', strokeStyle).
    attr('stroke-width', lineWidth).
    attr('fill', 'none').
    attr('d', `M ${sta[0]} ${sta[1]} L ${end[0]} ${end[1]}`);
  if (dash) {
    path.style('stroke-dasharray', dash.join(','));
  }
  return path;
}

function connect(g, x1, y1, x2, y2, startPosition, endPosition, lineWidth,
  strokeStyle, markered) {
  if (!endPosition) {
    endPosition = x1 > x2 ? 'right' : 'left';
  }

  let points = [];
  let start = [x1, y1];
  let end = [x2, y2];
  let centerX = start[0] + (end[0] - start[0]) / 2;
  let centerY = start[1] + (end[1] - start[1]) / 2;
  let second;
  let addVerticalCenterLine = function () {
    let third = [centerX, second[1]];
    let forth = [centerX, penult[1]];
    points.push(third);
    points.push(forth);
  };
  let addHorizontalCenterLine = function () {
    let third = [second[0], centerY];
    let forth = [penult[0], centerY];
    points.push(third);
    points.push(forth);
  };
  let addHorizontalTopLine = function () {
    points.push([second[0], start[1] - 50]);
    points.push([penult[0], start[1] - 50]);
  };
  let addHorizontalBottomLine = function () {
    points.push([second[0], start[1] + 50]);
    points.push([penult[0], start[1] + 50]);
  };
  let addVerticalRightLine = function () {
    points.push([start[0] + 80, second[1]]);
    points.push([start[0] + 80, penult[1]]);
  };
  let addVerticalLeftLine = function () {
    points.push([start[0] - 80, second[1]]);
    points.push([start[0] - 80, penult[1]]);
  };
  let addSecondXPenultY = function () {
    points.push([second[0], penult[1]]);
  };
  let addPenultXSecondY = function () {
    points.push([penult[0], second[1]]);
  };
  switch (startPosition) {
    case 'left':
      second = [start[0] - 20, start[1]];
      break;
    case 'top':
      second = [start[0], start[1] - 20];
      break;
    case 'bottom':
      second = [start[0], start[1] + 20];
      break;
    default:
      second = [start[0] + 20, start[1]];
      break;
  }
  let penult = null;
  switch (endPosition) {
    case 'right':
      penult = [end[0] + 20, end[1]];
      break;
    case 'top':
      penult = [end[0], end[1] - 20];
      break;
    case 'bottom':
      penult = [end[0], end[1] + 20];
      break;
    default:
      penult = [end[0] - 20, end[1]];
      break;
  }
  points.push(start);
  points.push(second);
  startPosition = startPosition || 'right';
  endPosition = endPosition || 'left';
  let direction = getDirection(x1, y1, x2, y2);
  if (direction.indexOf('r') > -1) {
    if (startPosition === 'right' || endPosition === 'left') {
      if (second[0] > centerX) {
        second[0] = centerX;
      }
      if (penult[0] < centerX) {
        penult[0] = centerX;
      }
    }
  }
  if (direction.indexOf('d') > -1) {
    if (startPosition === 'bottom' || endPosition === 'top') {
      if (second[1] > centerY) {
        second[1] = centerY;
      }
      if (penult[1] < centerY) {
        penult[1] = centerY;
      }
    }
  }
  if (direction.indexOf('l') > -1) {
    if (startPosition === 'left' || endPosition === 'right') {
      if (second[0] < centerX) {
        second[0] = centerX;
      }
      if (penult[0] > centerX) {
        penult[0] = centerX;
      }
    }
  }
  if (direction.indexOf('u') > -1) {
    if (startPosition === 'top' || endPosition === 'bottom') {
      if (second[1] < centerY) {
        second[1] = centerY;
      }
      if (penult[1] > centerY) {
        penult[1] = centerY;
      }
    }
  }
  switch (direction) {
    case 'lu': {
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'top':
          case 'right':
            addSecondXPenultY();
            break;
          default: {
            addHorizontalCenterLine();
            break;
          }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'top':
            addVerticalCenterLine();
            break;
          default: {
            addPenultXSecondY();
            break;
          }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'top':
          case 'right':
            addSecondXPenultY();
            break;
          default: {
            addHorizontalCenterLine();
            break;
          }
        }
      } else {
        // startPosition is left
        switch (endPosition) {
          case 'top':
          case 'right':
            addVerticalCenterLine();
            break;
          default: {
            addPenultXSecondY();
            break;
          }
        }
      }
      break;
    }
    case 'u':
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'right': {
            break;
          }
          case 'top': {
            addSecondXPenultY();
            break;
          }
          default: {
            addHorizontalCenterLine();
            break;
          }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'left':
          case 'right':
            addPenultXSecondY();
            break;
          default: {
            addVerticalRightLine();
            break;
          }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'left': {
            addPenultXSecondY();
            break;
          }
          case 'right': {
            addHorizontalCenterLine();
            break;
          }
          case 'top':
            addVerticalRightLine();
            break;
          default: {
            break;
          }
        }
      } else {
        // left
        switch (endPosition) {
          case 'left':
          case 'right':
            break;
          default: {
            points.push([second[0], penult[1]]);
            break;
          }
        }
      }
      break;
    case 'ru':
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'left': {
            addVerticalCenterLine();
            break;
          }
          case 'top': {
            addSecondXPenultY();
            break;
          }
          default: {
            addPenultXSecondY();
            break;
          }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'top': {
            addVerticalCenterLine();
            break;
          }
          default: {
            addPenultXSecondY();
            break;
          }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'right': {
            addVerticalCenterLine();
            break;
          }
          default: {
            addSecondXPenultY();
            break;
          }
        }
      } else {
        // left
        switch (endPosition) {
          case 'left':
          case 'top':
            addSecondXPenultY();
            break;
          default: {
            addHorizontalCenterLine();
            break;
          }
        }
      }
      break;
    case 'l':
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'left':
          case 'right':
          case 'top':
            addHorizontalTopLine();
            break;
          default: {
            addHorizontalBottomLine();
            break;
          }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'left': {
            addHorizontalBottomLine();
            break;
          }
          case 'right': {
            addSecondXPenultY();
            break;
          }
          case 'top': {
            addVerticalCenterLine();
            break;
          }
          default: {
            break;
          }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'left': {
            addHorizontalTopLine();
            break;
          }
          case 'right': {
            addSecondXPenultY();
            break;
          }
          case 'top': {
            break;
          }
          default: {
            addVerticalCenterLine();
            break;
          }
        }
      } else {
        // left
        switch (endPosition) {
          case 'left': {
            addHorizontalTopLine();
            break;
          }
          case 'right': {
            break;
          }
          default: {
            addSecondXPenultY();
            break;
          }
        }
      }
      break;
    case 'r':
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'left': {
            break;
          }
          case 'right': {
            addHorizontalTopLine();
            break;
          }
          default: {
            addSecondXPenultY();
            break;
          }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'left': {
            addSecondXPenultY();
            break;
          }
          case 'right': {
            addHorizontalBottomLine();
            break;
          }
          case 'top': {
            addVerticalCenterLine();
            break;
          }
          default: {
            break;
          }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'left': {
            addPenultXSecondY();
            break;
          }
          case 'right': {
            addHorizontalTopLine();
            break;
          }
          case 'top': {
            break;
          }
          default: {
            addVerticalCenterLine();
            break;
          }
        }
      } else {
        // left
        switch (endPosition) {
          case 'left':
          case 'right':
          case 'top':
            addHorizontalTopLine();
            break;
          default: {
            addHorizontalBottomLine();
            break;
          }
        }
      }
      break;
    case 'ld':
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'left': {
            addHorizontalCenterLine();
            break;
          }
          default: {
            addSecondXPenultY();
            break;
          }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'left': {
            addPenultXSecondY();
            break;
          }
          case 'top': {
            addHorizontalCenterLine();
            break;
          }
          default: {
            addSecondXPenultY();
            break;
          }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'left':
          case 'right':
          case 'top':
            addPenultXSecondY();
            break;
          default: {
            addVerticalCenterLine();
            break;
          }
        }
      } else {
        // left
        switch (endPosition) {
          case 'left':
          case 'top':
            addPenultXSecondY();
            break;
          case 'right': {
            addVerticalCenterLine();
            break;
          }
          default: {
            addSecondXPenultY();
            break;
          }
        }
      }
      break;
    case 'd':
      if (startPosition === 'right') {
        switch (endPosition) {
          case 'left': {
            addHorizontalCenterLine();
            break;
          }
          case 'right': {
            addPenultXSecondY();
            break;
          }
          case 'top': {
            addSecondXPenultY();
            break;
          }
          default: {
            addVerticalRightLine();
            break;
          }
        }
      } else if (startPosition === 'bottom') {
        switch (endPosition) {
          case 'left':
          case 'right':
            addPenultXSecondY();
            break;
          case 'top': {
            break;
          }
          default: {
            addVerticalRightLine();
            break;
          }
        }
      } else if (startPosition === 'top') {
        switch (endPosition) {
          case 'left': {
            addVerticalLeftLine();
            break;
          }
          default: {
            addVerticalRightLine();
            break;
          }
        }
      } else {
        // left
        switch (endPosition) {
          case 'left': {
            break;
          }
          case 'right': {
            addHorizontalCenterLine();
            break;
          }
          case 'top': {
            addSecondXPenultY();
            break;
          }
          default: {
            addVerticalLeftLine();
            break;
          }
        }
      }
      break;
    case 'rd': {
      if (startPosition === 'right' && endPosition === 'left') {
        addVerticalCenterLine();
      } else if (startPosition === 'right' && endPosition === 'bottom') {
        addSecondXPenultY();
      } else if (
        (startPosition === 'right' && endPosition === 'top') ||
        (startPosition === 'right' && endPosition === 'right')
      ) {
        addPenultXSecondY();
      } else if (startPosition === 'bottom' && endPosition === 'left') {
        addSecondXPenultY();
      } else if (startPosition === 'bottom' && endPosition === 'right') {
        addPenultXSecondY();
      } else if (startPosition === 'bottom' && endPosition === 'top') {
        addHorizontalCenterLine();
      } else if (startPosition === 'bottom' && endPosition === 'bottom') {
        addSecondXPenultY();
      } else if (startPosition === 'top' && endPosition === 'left') {
        addPenultXSecondY();
      } else if (startPosition === 'top' && endPosition === 'right') {
        addPenultXSecondY();
      } else if (startPosition === 'top' && endPosition === 'top') {
        addPenultXSecondY();
      } else if (startPosition === 'top' && endPosition === 'bottom') {
        addVerticalCenterLine();
      } else if (startPosition === 'left' && endPosition === 'left') {
        addSecondXPenultY();
      } else if (startPosition === 'left' && endPosition === 'right') {
        addHorizontalCenterLine();
      } else if (startPosition === 'left' && endPosition === 'top') {
        addHorizontalCenterLine();
      } else if (startPosition === 'left' && endPosition === 'bottom') {
        addSecondXPenultY();
      }
      break;
    }
  }
  points.push(penult);
  points.push(end);

  let lines = [];
  let paths = [];
  for (let i = 0; i < points.length; i++) {
    let source = points[i];
    let destination = points[i + 1];
    lines.push({
      sourceX: source[0],
      sourceY: source[1],
      destinationX: destination[0],
      destinationY: destination[1],
    });
    let finish = i === points.length - 2;
    if (finish && markered) {
      let path = arrowTo(g, source[0], source[1], destination[0],
        destination[1], lineWidth, strokeStyle);
      paths.push(path);
      break;
    } else {
      let path = lineTo(g, source[0], source[1], destination[0], destination[1],
        lineWidth, strokeStyle);
      paths.push(path);
    }
    if (finish) {
      break;
    }
  }
  return { lines, paths };
}

function arrowTo(g, x1, y1, x2, y2, lineWidth, strokeStyle) {
  let path = lineTo(g, x1, y1, x2, y2, lineWidth, strokeStyle);
  const id = 'arrow' + strokeStyle.replace('#', '');
  g.append('marker').
    attr('id', id).
    attr('markerUnits', 'strokeWidth').
    attr('viewBox', '0 0 12 12').
    attr('refX', 9).
    attr('refY', 6).
    attr('markerWidth', 12).
    attr('markerHeight', 12).
    attr('orient', 'auto').
    append('path').
    attr('d', 'M2,2 L10,6 L2,10 L6,6 L2,2').
    attr('fill', strokeStyle);
  path.attr('marker-end', 'url(#' + id + ')');
  return path;
}

function getDirection(x1, y1, x2, y2) {
  // Use approximatelyEquals to fix the problem of css position presicion
  if (x2 < x1 && approximatelyEquals(y2, y1)) {
    return 'l';
  }
  if (x2 > x1 && approximatelyEquals(y2, y1)) {
    return 'r';
  }
  if (approximatelyEquals(x2, x1) && y2 < y1) {
    return 'u';
  }
  if (approximatelyEquals(x2, x1) && y2 > y1) {
    return 'd';
  }
  if (x2 < x1 && y2 < y1) {
    return 'lu';
  }
  if (x2 > x1 && y2 < y1) {
    return 'ru';
  }
  if (x2 < x1 && y2 > y1) {
    return 'ld';
  }
  return 'rd';
}

export function getConnectorPosition(node) {
  const halfWidth = node.width / 2;
  const halfHeight = node.height / 2;
  // let top = { x: node.x + halfWidth, y: node.y - 10 };
  let left = { x: node.x, y: node.y + halfHeight, side: "left" };
  // let bottom = { x: node.x + halfWidth, y: node.y + node.height + 10 };
  let right = { x: node.x + node.width, y: node.y + halfHeight, side: "right" };

  return [left, right];
}

export const getCenter = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = "right",
  targetPosition = "left",
  constantOffset = null
}) => {
  const sourceIsLeftOrRight = LeftOrRight.includes(sourcePosition)
  const targetIsLeftOrRight = LeftOrRight.includes(targetPosition)

  // we expect flows to be horizontal or vertical (all handles left or right respectively top or bottom)
  // a mixed edge is when one the source is on the left and the target is on the top for example.
  const mixedEdge = (sourceIsLeftOrRight && !targetIsLeftOrRight) || (targetIsLeftOrRight && !sourceIsLeftOrRight)

  if (mixedEdge) {
    const xOffset = sourceIsLeftOrRight ? Math.abs(targetX - sourceX) : 0
    const centerX = sourceX > targetX ? sourceX - xOffset : sourceX + xOffset

    const yOffset = sourceIsLeftOrRight ? 0 : Math.abs(targetY - sourceY)
    const centerY = sourceY < targetY ? sourceY + yOffset : sourceY - yOffset

    return [centerX, centerY, xOffset, yOffset]
  }

  const xOffset = constantOffset || Math.abs(targetX - sourceX) / 2
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset

  const yOffset = constantOffset || Math.abs(targetY - sourceY) / 2
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset

  return [centerX, centerY, xOffset, yOffset]
}

export function getBezierPath({
  sourceX,
  sourceY,
  sourcePosition = "right",
  targetX,
  targetY,
  targetPosition = "left",
  centerX,
  centerY,
}) {
  const [_centerX, _centerY] = getCenter({ sourceX, sourceY, targetX, targetY })

  const leftAndRight = ["left", "right"]

  const cX = typeof centerX !== 'undefined' ? centerX : _centerX
  const cY = typeof centerY !== 'undefined' ? centerY : _centerY

  let path = `M${sourceX},${sourceY} C${sourceX},${cY} ${targetX},${cY} ${targetX},${targetY}`

  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    path = `M${sourceX},${sourceY} C${cX},${sourceY} ${cX},${targetY} ${targetX},${targetY}`
  } else if (leftAndRight.includes(targetPosition)) {
    path = `M${sourceX},${sourceY} Q${sourceX},${targetY} ${sourceX},${targetY} ${targetX},${targetY}`
  } else if (leftAndRight.includes(sourcePosition)) {
    path = `M${sourceX},${sourceY} Q${targetX},${sourceY} ${targetX},${sourceY} ${targetX},${targetY}`
  }

  return path
}

export const bottomLeftCorner = (x, y, size) => `L ${x},${y - size}Q ${x},${y} ${x + size},${y}`
export const leftBottomCorner = (x, y, size) => `L ${x + size},${y}Q ${x},${y} ${x},${y - size}`
export const bottomRightCorner = (x, y, size) => `L ${x},${y - size}Q ${x},${y} ${x - size},${y}`
export const rightBottomCorner = (x, y, size) => `L ${x - size},${y}Q ${x},${y} ${x},${y - size}`
export const leftTopCorner = (x, y, size) => `L ${x + size},${y}Q ${x},${y} ${x},${y + size}`
export const topLeftCorner = (x, y, size) => `L ${x},${y + size}Q ${x},${y} ${x + size},${y}`
export const topRightCorner = (x, y, size) => `L ${x},${y + size}Q ${x},${y} ${x - size},${y}`
export const rightTopCorner = (x, y, size) => `L ${x - size},${y}Q ${x},${y} ${x},${y + size}`

export function getSmoothStepPath({
  sourceX,
  sourceY,
  sourcePosition = "right",
  targetX,
  targetY,
  targetPosition = "left",
  borderRadius = 5,
  centerX,
  centerY,
}) {
  const [_centerX, _centerY, offsetX, offsetY] = getCenter({ sourceX, sourceY, targetX, targetY, constantOffset: 20 })
  const cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX))
  const cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY))
  const cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY)
  const leftAndRight = ["left", "right"]
  const cX = typeof centerX !== 'undefined' ? centerX : _centerX
  const cY = typeof centerY !== 'undefined' ? centerY : _centerY

  let firstCornerPath
  let secondCornerPath

  if (sourceX <= targetX) {
    firstCornerPath = sourceY <= targetY ? bottomLeftCorner(sourceX, cY, cornerSize) : topLeftCorner(sourceX, cY, cornerSize)
    secondCornerPath = sourceY <= targetY ? rightTopCorner(targetX, cY, cornerSize) : rightBottomCorner(targetX, cY, cornerSize)
  } else {
    firstCornerPath = sourceY < targetY ? bottomRightCorner(sourceX, cY, cornerSize) : topRightCorner(sourceX, cY, cornerSize)
    secondCornerPath = sourceY < targetY ? leftTopCorner(targetX, cY, cornerSize) : leftBottomCorner(targetX, cY, cornerSize)
  }

  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    if (sourceX <= targetX) {
      firstCornerPath = sourceY <= targetY ? rightTopCorner(cX, sourceY, cornerSize) : rightBottomCorner(cX, sourceY, cornerSize)
      secondCornerPath = sourceY <= targetY ? bottomLeftCorner(cX, targetY, cornerSize) : topLeftCorner(cX, targetY, cornerSize)
    } else if (sourcePosition === "right" && targetPosition === "left") {
      // and sourceX > targetX
      firstCornerPath = sourceY <= targetY ? leftTopCorner(cX, sourceY, cornerSize) : leftBottomCorner(cX, sourceY, cornerSize)
      secondCornerPath = sourceY <= targetY ? bottomRightCorner(cX, targetY, cornerSize) : topRightCorner(cX, targetY, cornerSize)
    }
  } else if (leftAndRight.includes(sourcePosition) && !leftAndRight.includes(targetPosition)) {
    if (sourceX <= targetX) {
      firstCornerPath =
        sourceY <= targetY ? rightTopCorner(targetX, sourceY, cornerSize) : rightBottomCorner(targetX, sourceY, cornerSize)
    } else {
      firstCornerPath =
        sourceY <= targetY ? leftTopCorner(targetX, sourceY, cornerSize) : leftBottomCorner(targetX, sourceY, cornerSize)
    }
    secondCornerPath = ''
  } else if (!leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    if (sourceX <= targetX) {
      firstCornerPath =
        sourceY <= targetY ? bottomLeftCorner(sourceX, targetY, cornerSize) : topLeftCorner(sourceX, targetY, cornerSize)
    } else {
      firstCornerPath =
        sourceY <= targetY ? bottomRightCorner(sourceX, targetY, cornerSize) : topRightCorner(sourceX, targetY, cornerSize)
    }
    secondCornerPath = ''
  }

  return `M ${sourceX},${sourceY}${firstCornerPath}${secondCornerPath}L ${targetX},${targetY}`
}

export function drawConnectors(parent, data, callback) {
  let connectors = getConnectorPosition(data);
  connectors.forEach(conn => {
    let connector = document.createElementNS(d3.namespaces.svg, "circle")
    connector.setAttribute("id", `${data.id}-connector-${conn.side}`)
    connector.setAttribute("cx", conn.x)
    connector.setAttribute("cy", conn.y)
    connector.setAttribute("r", 4)
    connector.setAttribute("class", "connector");
    connector.setAttribute("fill", "black");
    connector.setAttribute("stroke", "white")

    connector.addEventListener("mouseover", (e) => d3.select(e.srcElement).attr("r", 6))
    connector.addEventListener("mouseleave", (e) => d3.select(e.srcElement).attr("r", 4))
    connector.addEventListener("mousedown", (e) => callback(e, data, conn))

    parent.appendChild(connector)
  })
}

export {
  arrowTo,
  lineTo,
  getDirection,
  connect,
};
