import * as d3 from "d3";

export const getCenter = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
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
  targetX,
  targetY,
  centerX,
  centerY,
}) {
  const [_centerX, _centerY, offsetX, offsetY] = getCenter({ sourceX, sourceY, targetX, targetY })

  const cX = typeof centerX !== 'undefined' ? centerX : _centerX
  const cY = typeof centerY !== 'undefined' ? centerY : _centerY
  if (sourceX <= targetX) {
    return `M${sourceX},${sourceY} C${cX},${sourceY} ${cX},${targetY} ${targetX},${targetY}`
  }

  if (sourceY <= targetY) {
    return `M${sourceX},${sourceY} C${sourceX + 20},${sourceY + 30} ${sourceX + 20},${sourceY + 30} ${sourceX - offsetX},${sourceY + offsetY} S ${targetX - 20} ${targetY - 30} ${targetX},${targetY}`
  }
  return `M${sourceX},${sourceY} C${sourceX + 20},${sourceY - 30} ${sourceX + 20},${sourceY - 30} ${sourceX - offsetX},${sourceY - offsetY} S ${targetX - 20} ${targetY + 30} ${targetX},${targetY}`
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
  targetX,
  targetY,
  borderRadius = 5,
  centerX,
  centerY,
}) {
  const [_centerX, _centerY, offsetX, offsetY] = getCenter({ sourceX, sourceY, targetX, targetY })
  const cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX))
  const cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY))
  const cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY)

  const cX = typeof centerX !== 'undefined' ? centerX : _centerX
  const cY = typeof centerY !== 'undefined' ? centerY : _centerY

  let firstCornerPath
  let secondCornerPath

  if (sourceX <= targetX) {
    firstCornerPath = sourceY <= targetY ? rightTopCorner(cX, sourceY, cornerSize) : rightBottomCorner(cX, sourceY, cornerSize)
    secondCornerPath = sourceY <= targetY ? bottomLeftCorner(cX, targetY, cornerSize) : topLeftCorner(cX, targetY, cornerSize)

    return `M ${sourceX},${sourceY}${firstCornerPath}${secondCornerPath}L ${targetX},${targetY}`
  }

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
}
