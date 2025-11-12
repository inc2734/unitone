/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/block-vertical-alignment-control/icons.js
 */

import { Path, SVG, Line } from '@wordpress/components';

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

export const allSides = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
		<Path d="M3 2H13V0H3V2ZM3 16H13V14H3V16Z" fill="currentColor" />
		<Path d="M0 3V13H2L2 3H0ZM14 3V13H16V3H14Z" fill="currentColor" />
	</SVG>
);

export const verticalSides = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
		<Path d="M3 2H13V0H3V2ZM3 16H13V14H3V16Z" fill="currentColor" />
		<Path
			d="M0 3V13H2L2 3H0ZM14 3V13H16V3H14Z"
			fill="currentColor"
			opacity={ 0.3 }
		/>
	</SVG>
);

export const horizontalSides = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
		<Path
			d="M3 2H13V0H3V2ZM3 16H13V14H3V16Z"
			fill="currentColor"
			opacity={ 0.3 }
		/>
		<Path d="M0 3V13H2L2 3H0ZM14 3V13H16V3H14Z" fill="currentColor" />
	</SVG>
);

export const topSides = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
		<Path
			d="M13 16H3V14H13V16ZM2 13H0V3H2V13ZM16 13H14V3H16V13Z"
			fill="currentColor"
			fillOpacity="0.3"
		/>
		<Line
			x1="3"
			y1="1"
			x2="13"
			y2="1"
			stroke="currentColor"
			strokeWidth="2"
		/>
	</SVG>
);

export const rightSides = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
		<Line
			x1="15"
			y1="3"
			x2="15"
			y2="13"
			stroke="currentColor"
			strokeWidth="2"
		/>
		<Path
			d="M13 16H3V14H13V16ZM2 13H0V3H2V13ZM13 2H3V0H13V2Z"
			fill="currentColor"
			fillOpacity="0.3"
		/>
	</SVG>
);

export const bottomSides = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
		<Line
			x1="3"
			y1="15"
			x2="13"
			y2="15"
			stroke="currentColor"
			strokeWidth="2"
		/>
		<Path
			d="M2 13H0V3H2V13ZM16 13H14V3H16V13ZM13 2H3V0H13V2Z"
			fill="currentColor"
			fillOpacity="0.3"
		/>
	</SVG>
);

export const leftSides = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
		<Line
			x1="1"
			y1="3"
			x2="1"
			y2="13"
			stroke="currentColor"
			strokeWidth="2"
		/>
		<Path
			d="M13 16H3V14H13V16ZM16 13H14V3H16V13ZM13 2H3V0H13V2Z"
			fill="currentColor"
			fillOpacity="0.3"
		/>
	</SVG>
);

export const auto = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
		<Path d="M12 8.5H4V7.5H12V8.5Z" fill="currentColor" />
	</SVG>
);

export const help = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path
			d="M16.5 18.0004C16.7761 18.0004 17 18.2243 17 18.5004C16.9999 18.7765 16.7761 19.0004 16.5 19.0004H7.5C7.22391 19.0004 7.00008 18.7765 7 18.5004C7 18.2243 7.22386 18.0004 7.5 18.0004H16.5ZM11.832 13.6703C12.1214 13.6704 12.3689 13.7683 12.5742 13.9643C12.7794 14.1602 12.8818 14.4167 12.8818 14.7338C12.8818 15.0512 12.7796 15.3083 12.5742 15.5043C12.3689 15.7003 12.1213 15.7983 11.832 15.7983C11.5334 15.7983 11.2858 15.7003 11.0898 15.5043C10.8938 15.3083 10.7959 15.0512 10.7959 14.7338C10.796 14.4167 10.894 14.1602 11.0898 13.9643C11.2952 13.7683 11.5427 13.6703 11.832 13.6703ZM12.0977 5.04633C12.7601 5.04633 13.3438 5.15308 13.8477 5.36761C14.3516 5.57294 14.7444 5.87645 15.0244 6.27777C15.3137 6.6791 15.458 7.16981 15.458 7.74847C15.4579 8.09365 15.3783 8.40173 15.2197 8.6723C15.0704 8.93353 14.8744 9.17158 14.6318 9.38617C14.3985 9.60079 14.1466 9.81076 13.876 10.0161C13.6147 10.212 13.3724 10.4176 13.1484 10.6323C12.9338 10.8376 12.7649 11.0711 12.6436 11.3325C12.5224 11.5843 12.4856 11.8829 12.5322 12.228H11.1035C11.0382 11.8454 11.0575 11.5094 11.1602 11.2202C11.2722 10.9215 11.4357 10.6556 11.6504 10.4223C11.865 10.1797 12.0977 9.96003 12.3496 9.7641C12.6109 9.55877 12.8541 9.36288 13.0781 9.17621C13.3115 8.98021 13.503 8.779 13.6523 8.57367C13.8108 8.35914 13.8896 8.13061 13.8896 7.88812C13.8896 7.58018 13.8153 7.31424 13.666 7.09027C13.5167 6.86627 13.2928 6.69305 12.9941 6.57172C12.7048 6.44106 12.3453 6.37641 11.916 6.3764C11.4587 6.3764 11.0249 6.47438 10.6143 6.67035C10.213 6.86632 9.82542 7.16463 9.45215 7.56586L8.52832 6.71234C8.97631 6.20836 9.49405 5.8069 10.082 5.50824C10.6699 5.20029 11.3418 5.04637 12.0977 5.04633Z"
			fill="currentColor"
		/>
	</SVG>
);
