import { connect } from "../svg";
import drawRect from "./rect"
import * as d3 from "d3"

export function drawShape(data) {
	let shape;
	if (data.shape == "rect") shape = drawRect(data);

	return shape;
}