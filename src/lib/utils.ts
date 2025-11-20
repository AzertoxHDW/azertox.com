import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { backOut, cubicInOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type WarpParams = {
	duration?: number;
	delay?: number;
};

export const warp = (
	node: Element,
	params: WarpParams = {}
): TransitionConfig => {
	return {
		duration: params.duration ?? 400,
		delay: params.delay ?? 0,
		css: (t) => {
			const eased = cubicInOut(t);
			const blur = (1 - eased) * 4;

			return `
				opacity: ${eased};
				filter: blur(${blur}px);
			`;
		}
	};
};

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
	delay?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.8, duration: 400 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (
		valueA: number,
		scaleA: [number, number],
		scaleB: [number, number]
	) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (
		style: Record<string, number | string | undefined>
	): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 400,
		delay: params.delay ?? 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.8, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: backOut
	};
};