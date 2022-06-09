import { namespaces } from "d3";

export default function drawRect(data) {
	console.log(namespaces)
	var node = document.createElementNS(namespaces.svg, "g");
	node.setAttribute("id", `${data.id}-container`)

	var rect = document.createElementNS(namespaces.svg, "rect");
	rect.setAttribute("id", `${data.id}-shape`)
	rect.setAttribute("rx", 5)
	rect.setAttribute("ry", 5)
	rect.setAttribute('x', data.x);
	rect.setAttribute('y', data.y);
	rect.setAttribute("class", "body")
	rect.setAttribute("width", data.width)
	rect.setAttribute("height", data.height)
	rect.setAttribute("fill", "white")
	rect.setAttribute('stroke', "black")
	rect.setAttribute("stroke-width", "1px");

	let bodyTextY = data.y + data.height / 2;
	var text = document.createElementNS(namespaces.svg, "text")
	text.setAttribute('x', data.x + data.width / 2);
	text.setAttribute('y', bodyTextY);
	text.setAttribute("dominant-baseline", "middle")
	text.setAttribute("class", "chart__text")
	text.setAttribute("text-anchor", "middle")
	text.textContent = data.name;
	node.appendChild(rect);
	node.appendChild(text);

	return node;
}