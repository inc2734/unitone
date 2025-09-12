<?php
/**
 * Title: Loading Animation (Bar Pulse)
 * Slug: unitone/loading-animation/bar-pulse
 * Categories: unitone-loading-animations
 * Block Types: core/template-part/unitone/loading-animation
 */
?>
<!-- wp:unitone/decorator {"unitone":{"padding":"1","justifyItems":"center","alignContent":"center"},"align":"full"} -->
<div data-unitone-layout="decorator" class="alignfull">
	<!-- wp:paragraph {"fontSize":"unitone-3xl"} -->
	<p class="has-unitone-3-xl-font-size"><span aria-hidden="true" style="--unitone--inline-svg: url(&quot;data:image/svg+xml;charset=UTF-8,%3Csvg%0A%09%09xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%09%09width%3D%2224%22%0A%09%09height%3D%2224%22%0A%09%09viewBox%3D%220%200%2024%2024%22%0A%09%09fill%3D%22none%22%0A%09%09stroke%3D%22currentColor%22%0A%09%09stroke-width%3D%222%22%0A%09%09stroke-linecap%3D%22round%22%0A%09%09role%3D%22img%22%0A%09%3E%0A%09%09%3Cline%20x1%3D%224%22%20y1%3D%2212%22%20x2%3D%224%22%20y2%3D%2212%22%20visibility%3D%22hidden%22%3E%0A%09%09%09%3Cset%20attributeName%3D%22visibility%22%20to%3D%22visible%22%20begin%3D%220s%3BleftReset.end%2B.5s%22%2F%3E%0A%0A%09%09%09%3Canimate%20id%3D%22leftGrow%22%20attributeName%3D%22x2%22%20values%3D%224%3B20%22%20dur%3D%220.5s%22%20begin%3D%220s%3BleftReset.end%2B.5s%22%20fill%3D%22freeze%22%20calcMode%3D%22spline%22%20keyTimes%3D%220%3B1%22%20keySplines%3D%220.5%2C%201%2C%200.89%2C%201%22%2F%3E%0A%0A%09%09%09%3Canimate%20id%3D%22leftShrink%22%20attributeName%3D%22x1%22%20values%3D%224%3B20%22%20dur%3D%220.5s%22%20begin%3D%22leftGrow.end-.05s%22%20fill%3D%22freeze%22%20calcMode%3D%22spline%22%20keyTimes%3D%220%3B1%22%20keySplines%3D%220.5%2C%201%2C%200.89%2C%201%22%2F%3E%0A%0A%09%09%09%3Cset%20attributeName%3D%22visibility%22%20to%3D%22hidden%22%20begin%3D%22leftShrink.end-.05s%22%2F%3E%0A%09%09%09%3Canimate%20attributeName%3D%22x1%22%20values%3D%2220%3B4%22%20dur%3D%22.001s%22%20begin%3D%22leftShrink.end%22%20fill%3D%22freeze%22%20id%3D%22leftReset%22%20%2F%3E%0A%09%09%09%3Canimate%20attributeName%3D%22x2%22%20values%3D%2220%3B4%22%20dur%3D%22.001s%22%20begin%3D%22leftShrink.end%22%20fill%3D%22freeze%22%2F%3E%0A%09%09%3C%2Fline%3E%0A%09%3C%2Fsvg%3E&quot;)" class="unitone-inline-icon"><span inert> </span></span></p>
	<!-- /wp:paragraph -->
</div>
<!-- /wp:unitone/decorator -->
