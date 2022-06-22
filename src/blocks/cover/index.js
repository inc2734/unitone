import { registerBlockType } from '@wordpress/blocks';
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import icon from '../icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

registerBlockType( 'unitone/cover', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
	variations: [
		{
			name: 'cover-top',
			title: __( 'Cover (Top)', 'unitone' ),
			isDefault: false,
			scope: [ 'block' ],
			innerBlocks: [ [ 'unitone/cover-content', { position: 'top' } ] ],
			icon: (
				<SVG
					width="48"
					height="48"
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Path
						d="M34.63,18.65H13.37a1.86,1.86,0,0,1-1.86-1.86V12.07a1.86,1.86,0,0,1,1.86-1.86H34.63a1.86,1.86,0,0,1,1.86,1.86v4.72A1.86,1.86,0,0,1,34.63,18.65ZM13.37,11.51a.56.56,0,0,0-.56.56v4.72a.56.56,0,0,0,.56.56H34.63a.56.56,0,0,0,.56-.56V12.07a.56.56,0,0,0-.56-.56Z"
						fillRule="evenodd"
						clipRule="evenodd"
					/>
				</SVG>
			),
		},
		{
			name: 'cover-center',
			title: __( 'Cover (Center)', 'unitone' ),
			isDefault: true,
			scope: [ 'block' ],
			innerBlocks: [
				[ 'unitone/cover-content', { position: 'center' } ],
			],
			icon: (
				<SVG
					width="48"
					height="48"
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Path
						d="M34.63,28.22H13.37a1.86,1.86,0,0,1-1.86-1.86V21.64a1.86,1.86,0,0,1,1.86-1.86H34.63a1.86,1.86,0,0,1,1.86,1.86v4.72A1.86,1.86,0,0,1,34.63,28.22ZM13.37,21.08a.56.56,0,0,0-.56.56v4.72a.56.56,0,0,0,.56.56H34.63a.56.56,0,0,0,.56-.56V21.64a.56.56,0,0,0-.56-.56Z"
						fillRule="evenodd"
						clipRule="evenodd"
					/>
				</SVG>
			),
		},
		{
			name: 'cover-bottom',
			title: __( 'Cover (Bottom)', 'unitone' ),
			isDefault: false,
			scope: [ 'block' ],
			innerBlocks: [
				[ 'unitone/cover-content', { position: 'bottom' } ],
			],
			icon: (
				<SVG
					width="48"
					height="48"
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Path
						d="M34.63,37.79H13.37a1.86,1.86,0,0,1-1.86-1.86V31.21a1.86,1.86,0,0,1,1.86-1.86H34.63a1.86,1.86,0,0,1,1.86,1.86v4.72A1.86,1.86,0,0,1,34.63,37.79ZM13.37,30.65a.56.56,0,0,0-.56.56v4.72a.56.56,0,0,0,.56.56H34.63a.56.56,0,0,0,.56-.56V31.21a.56.56,0,0,0-.56-.56Z"
						fillRule="evenodd"
						clipRule="evenodd"
					/>
				</SVG>
			),
		},
		{
			name: 'cover-top-center',
			title: __( 'Cover (Top / Center)', 'unitone' ),
			isDefault: false,
			scope: [ 'block' ],
			innerBlocks: [
				[ 'unitone/cover-content', { position: 'top' } ],
				[ 'unitone/cover-content', { position: 'center' } ],
			],
			icon: (
				<SVG
					width="48"
					height="48"
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Path
						d="M34.63,28.22H13.37a1.86,1.86,0,0,1-1.86-1.86V21.64a1.86,1.86,0,0,1,1.86-1.86H34.63a1.86,1.86,0,0,1,1.86,1.86v4.72A1.86,1.86,0,0,1,34.63,28.22ZM13.37,21.08a.56.56,0,0,0-.56.56v4.72a.56.56,0,0,0,.56.56H34.63a.56.56,0,0,0,.56-.56V21.64a.56.56,0,0,0-.56-.56Z"
						fill="#337bb5"
					/>
					<path
						d="M34.63,18.65H13.37a1.86,1.86,0,0,1-1.86-1.86V12.07a1.86,1.86,0,0,1,1.86-1.86H34.63a1.86,1.86,0,0,1,1.86,1.86v4.72A1.86,1.86,0,0,1,34.63,18.65ZM13.37,11.51a.56.56,0,0,0-.56.56v4.72a.56.56,0,0,0,.56.56H34.63a.56.56,0,0,0,.56-.56V12.07a.56.56,0,0,0-.56-.56Z"
						fillRule="evenodd"
						clipRule="evenodd"
					/>
				</SVG>
			),
		},
		{
			name: 'cover-top-bottom',
			title: __( 'Cover (Top / Bottom)', 'unitone' ),
			isDefault: false,
			scope: [ 'block' ],
			innerBlocks: [
				[ 'unitone/cover-content', { position: 'top' } ],
				[ 'unitone/cover-content', { position: 'bottom' } ],
			],
			icon: (
				<SVG
					width="48"
					height="48"
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Path
						d="M34.63,37.79H13.37a1.86,1.86,0,0,1-1.86-1.86V31.21a1.86,1.86,0,0,1,1.86-1.86H34.63a1.86,1.86,0,0,1,1.86,1.86v4.72A1.86,1.86,0,0,1,34.63,37.79ZM13.37,30.65a.56.56,0,0,0-.56.56v4.72a.56.56,0,0,0,.56.56H34.63a.56.56,0,0,0,.56-.56V31.21a.56.56,0,0,0-.56-.56Z"
						fillRule="evenodd"
						clipRule="evenodd"
					/>
					<Path
						d="M34.63,18.65H13.37a1.86,1.86,0,0,1-1.86-1.86V12.07a1.86,1.86,0,0,1,1.86-1.86H34.63a1.86,1.86,0,0,1,1.86,1.86v4.72A1.86,1.86,0,0,1,34.63,18.65ZM13.37,11.51a.56.56,0,0,0-.56.56v4.72a.56.56,0,0,0,.56.56H34.63a.56.56,0,0,0,.56-.56V12.07a.56.56,0,0,0-.56-.56Z"
						fillRule="evenodd"
						clipRule="evenodd"
					/>
				</SVG>
			),
		},
		{
			name: 'cover-center-bottom',
			title: __( 'Cover (Center / Bottom)', 'unitone' ),
			isDefault: false,
			scope: [ 'block' ],
			innerBlocks: [
				[ 'unitone/cover-content', { position: 'center' } ],
				[ 'unitone/cover-content', { position: 'bottom' } ],
			],
			icon: (
				<SVG
					width="48"
					height="48"
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Path
						d="M34.63,28.22H13.37a1.86,1.86,0,0,1-1.86-1.86V21.64a1.86,1.86,0,0,1,1.86-1.86H34.63a1.86,1.86,0,0,1,1.86,1.86v4.72A1.86,1.86,0,0,1,34.63,28.22ZM13.37,21.08a.56.56,0,0,0-.56.56v4.72a.56.56,0,0,0,.56.56H34.63a.56.56,0,0,0,.56-.56V21.64a.56.56,0,0,0-.56-.56Z"
						fillRule="evenodd"
						clipRule="evenodd"
					/>
					<Path
						d="M34.63,37.79H13.37a1.86,1.86,0,0,1-1.86-1.86V31.21a1.86,1.86,0,0,1,1.86-1.86H34.63a1.86,1.86,0,0,1,1.86,1.86v4.72A1.86,1.86,0,0,1,34.63,37.79ZM13.37,30.65a.56.56,0,0,0-.56.56v4.72a.56.56,0,0,0,.56.56H34.63a.56.56,0,0,0,.56-.56V31.21a.56.56,0,0,0-.56-.56Z"
						fillRule="evenodd"
						clipRule="evenodd"
					/>
				</SVG>
			),
		},
	],
} );
