import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import './index.scss';

import icon from './icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

registerBlockType( 'unitone/slider', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
	example: {
		viewportWidth: 1280,
		attributes: {
			arrowsAlignment: 'center',
			arrowsJustification: 'space-between',
			pagination: true,
			slideWidth: '40%',
			hideOutside: true,
		},
		innerBlocks: [
			{
				name: 'unitone/slide',
				innerBlocks: [
					{
						name: 'unitone/stack',
						attributes: {
							unitone: {
								gap: '-1',
							},
						},
						innerBlocks: [
							{
								name: 'unitone/frame',
								attributes: {
									ratio: '4/3',
								},
								innerBlocks: [
									{
										name: 'core/image',
										attributes: {
											id: 1,
											url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
										},
									},
								],
							},
							{
								name: 'core/heading',
								attributes: {
									level: 3,
									content: 'Lorem ipsum dolor sit amet',
								},
							},
							{
								name: 'core/paragraph',
								attributes: {
									content:
										'consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
								},
							},
						],
					},
				],
			},
			{
				name: 'unitone/slide',
				innerBlocks: [
					{
						name: 'unitone/stack',
						attributes: {
							unitone: {
								gap: '-1',
							},
						},
						innerBlocks: [
							{
								name: 'unitone/frame',
								attributes: {
									ratio: '4/3',
								},
								innerBlocks: [
									{
										name: 'core/image',
										attributes: {
											id: 1,
											url: `${ unitone.url }/dist/img/stocksnap_ydxj69toal.jpg`,
										},
									},
								],
							},
							{
								name: 'core/heading',
								attributes: {
									level: 3,
									content: 'Lorem ipsum dolor sit amet',
								},
							},
							{
								name: 'core/paragraph',
								attributes: {
									content:
										'consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
								},
							},
						],
					},
				],
			},
			{
				name: 'unitone/slide',
				innerBlocks: [
					{
						name: 'unitone/stack',
						attributes: {
							unitone: {
								gap: '-1',
							},
						},
						innerBlocks: [
							{
								name: 'unitone/frame',
								attributes: {
									ratio: '4/3',
								},
								innerBlocks: [
									{
										name: 'core/image',
										attributes: {
											id: 1,
											url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
										},
									},
								],
							},
							{
								name: 'core/heading',
								attributes: {
									level: 3,
									content: 'Lorem ipsum dolor sit amet',
								},
							},
							{
								name: 'core/paragraph',
								attributes: {
									content:
										'consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
								},
							},
						],
					},
				],
			},
		],
	},
} );
