import * as d3 from "d3";

export const getCenter = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = "right",
  targetPosition = "left",
  constantOffset = null
}) => {
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
  const [_centerX, _centerY, offsetX, offsetY] = getCenter({ sourceX, sourceY, targetX, targetY })
  const cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX))
  const cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY))
  const cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY)
  const leftAndRight = ["left", "right"]
  const cX = typeof centerX !== 'undefined' ? centerX : _centerX
  const cY = typeof centerY !== 'undefined' ? centerY : _centerY

  let firstCornerPath
  let secondCornerPath

  if (sourceX <= targetX) {
    firstCornerPath = sourceY <= targetY ? rightTopCorner(cX, sourceY, cornerSize) : rightBottomCorner(cX, sourceY, cornerSize)
    secondCornerPath = sourceY <= targetY ? bottomLeftCorner(cX, targetY, cornerSize) : topLeftCorner(cX, targetY, cornerSize)

    return `M ${sourceX},${sourceY}${firstCornerPath}${secondCornerPath}L ${targetX},${targetY}`
  } else {
    let firstLine;
    if (sourceY <= targetY) {
      firstCornerPath = `${bottomRightCorner(sourceX + 20, sourceY + offsetY, cornerSize)} ${rightBottomCorner(sourceX + 20 - offsetX, sourceY + offsetY, 0)}`
      secondCornerPath = `${leftTopCorner(sourceX - offsetX * 2 - 20, sourceY + offsetY, cornerSize)} ${bottomLeftCorner(sourceX - offsetX * 2 - 20, targetY, cornerSize)}`
      firstLine = rightTopCorner(sourceX + 20, sourceY, cornerSize)
    }
    else {
      firstCornerPath = `${topRightCorner(sourceX + 20, sourceY - offsetY, cornerSize)} ${rightBottomCorner(sourceX + 20 - offsetX, sourceY - offsetY, 0)}`
      secondCornerPath = `${leftBottomCorner(sourceX - offsetX * 2 - 20, sourceY - offsetY, cornerSize)} ${topLeftCorner(sourceX - offsetX * 2 - 20, targetY, cornerSize)}`
      firstLine = rightBottomCorner(sourceX + 20, sourceY, cornerSize)
    }

    return `M ${sourceX},${sourceY}, ${firstLine} ${firstCornerPath} ${secondCornerPath} L ${targetX},${targetY}`

    // return `M ${sourceX},${sourceY}, L ${sourceX + 20},${sourceY}  L ${sourceX + 20},${sourceY - offsetY}  L ${sourceX + 20 - offsetX},${sourceY - offsetY}`
    // return `M ${sourceX},${sourceY}${firstCornerPath}${secondCornerPath}L ${targetX},${targetY}`

  }

}
