/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/block-vertical-alignment-control/icons.js
 */

import { Path, SVG } from '@wordpress/components';

export const alignBottom = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M15 4H9v11h6V4zM4 18.5V20h16v-1.5H4z" />
	</SVG>
);

export const alignBottomExpanded = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M15 13H9V24H15V13ZM4 18.5V20H20V18.5H4Z" />
	</SVG>
);

export const alignCenter = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M20 11h-5V4H9v7H4v1.5h5V20h6v-7.5h5z" />
	</SVG>
);

export const alignTop = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M9 20h6V9H9v11zM4 4v1.5h16V4H4z" />
	</SVG>
);

export const alignTopExpanded = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M9 11H15V0H9V11ZM4 4V5.5H20V4H4Z" />
	</SVG>
);

export const alignStretch = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M4 4L20 4L20 5.5L4 5.5L4 4ZM10 7L14 7L14 17L10 17L10 7ZM20 18.5L4 18.5L4 20L20 20L20 18.5Z" />
	</SVG>
);

export const alignSpaceBetween = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M7 4H17V8L7 8V4ZM7 16L17 16V20L7 20V16ZM20 11.25H4V12.75H20V11.25Z" />
	</SVG>
);
