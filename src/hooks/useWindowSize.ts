import { useState, useEffect } from "react";

// https://stackoverflow.com/a/63408216
export function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: 1920,
		height: 1080,
	});

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return windowSize;
}
