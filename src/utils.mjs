// from: https://greensock.com/forums/topic/13681-svg-gotchas/page/2/?tab=comments#comment-72060
/**
 * @param {SVGElement} element - Element to get the bounding box for
 * @param {boolean} [withoutTransforms=false] - If true, transforms will not be calculated
 * @param {SVGElement} [toElement] - Element to calculate bounding box relative to
 * @returns {SVGRect} Coordinates and dimensions of the real bounding box
 */
export const getBBox = (element, withoutTransforms, toElement) => {
	var svg = element.ownerSVGElement;

	if (!svg) {
		return { x: 0, y: 0, cx: 0, cy: 0, width: 0, height: 0 };
	}

	var r = element.getBBox();

	if (withoutTransforms) {
		return {
			x: r.x,
			y: r.y,
			width: r.width,
			height: r.height,
			cx: r.x + r.width / 2,
			cy: r.y + r.height / 2
		};
	}

	var p = svg.createSVGPoint();

	var matrix = (toElement || svg).getScreenCTM().inverse().multiply(element.getScreenCTM());

	p.x = r.x;
	p.y = r.y;
	var a = p.matrixTransform(matrix);

	p.x = r.x + r.width;
	p.y = r.y;
	var b = p.matrixTransform(matrix);

	p.x = r.x + r.width;
	p.y = r.y + r.height;
	var c = p.matrixTransform(matrix);

	p.x = r.x;
	p.y = r.y + r.height;
	var d = p.matrixTransform(matrix);

	var minX = Math.min(a.x, b.x, c.x, d.x);
	var maxX = Math.max(a.x, b.x, c.x, d.x);
	var minY = Math.min(a.y, b.y, c.y, d.y);
	var maxY = Math.max(a.y, b.y, c.y, d.y);

	var width = maxX - minX;
	var height = maxY - minY;

	return {
		x: minX,
		y: minY,
		width: width,
		height: height,
		cx: minX + width / 2,
		cy: minY + height / 2
	};
};

export const checkIntersection = (r1, r2) => {
	return !(r1.x + r1.width < r2.x || r1.y + r1.height < r2.y || r1.x > r2.x + r2.width || r1.y > r2.y + r2.height);
};

export const checkContains = (r1, r2) => {
	return r2.x + r2.width < r1.x + r1.width && r2.x > r1.x && r2.y > r1.y && r2.y + r2.height < r1.y + r1.height;
};
