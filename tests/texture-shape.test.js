import { renderToStaticMarkup } from 'react-dom/server';

import save from '../src/blocks/texture/save';
import {
	getShapePoints,
	getShapePointsFromShapeSize,
	getTextureStyle,
	getTextureTypeDefaultAttributes,
} from '../src/blocks/texture/utils';

jest.mock(
	'@wordpress/block-editor',
	() => ( {
		useBlockProps: { save: ( props ) => props },
		useInnerBlocksProps: { save: ( props ) => props },
	} ),
	{ virtual: true }
);

const renderSave = ( saveFunction, attributes ) =>
	renderToStaticMarkup( saveFunction( { attributes } ) );

describe( 'texture shape points', () => {
	it( 'keeps the saved two-value shape until conversion', () => {
		const attributes = {
			type: 'slash-shape',
			shapeSize: { top: '20px', bottom: '35%' },
		};
		const style = getTextureStyle( attributes );
		expect( getShapePoints( attributes.type, attributes.shapePoints ) ).toBeUndefined();
		expect( style[ '--unitone--texture-band-top-size' ] ).toBe( '20px' );
		expect( style[ '--unitone--texture-band-bottom-size' ] ).toBe( '35%' );
		expect( style[ '--unitone--texture-shape-top-left-y' ] ).toBeUndefined();

		const markup = renderSave( save, attributes );
		expect( markup ).toContain( '--unitone--texture-band-top-size:20px' );
		expect( markup ).toContain( '--unitone--texture-band-bottom-size:35%' );
		expect( markup ).not.toContain( 'texture-shape-top-left-y' );
	} );

	it( 'starts a newly selected shape with four points', () => {
		const shapePoints = getTextureTypeDefaultAttributes( 'slash-shape' )
			.shapePoints;
		expect( shapePoints ).toEqual( {
			topLeft: '75%',
			bottomLeft: '100%',
			topRight: '0%',
			bottomRight: '25%',
		} );
		expect( getShapePoints( 'slash-shape', shapePoints ) ).toEqual(
			shapePoints
		);
	} );

	it( 'converts current slash values without changing their units', () => {
		expect(
			getShapePointsFromShapeSize( 'slash-shape', {
				top: '20px',
				bottom: '35%',
			} )
		).toEqual( {
			topLeft: '65%',
			bottomLeft: '100%',
			topRight: '0%',
			bottomRight: '20px',
		} );
	} );

	it( 'uses shape defaults where a backslash value cannot be converted', () => {
		expect(
			getShapePointsFromShapeSize( 'backslash-shape', {
				top: '12px',
				bottom: '8px',
			} )
		).toEqual( {
			topLeft: '0%',
			bottomLeft: '25%',
			topRight: '75%',
			bottomRight: '100%',
		} );
	} );

	it( 'converts zero lengths and percentages from bottom to top', () => {
		expect(
			getShapePointsFromShapeSize( 'backslash-shape', {
				top: '20%',
				bottom: '0px',
			} )
		).toEqual( {
			topLeft: '0%',
			bottomLeft: '25%',
			topRight: '100%',
			bottomRight: '100%',
		} );
	} );

	it( 'saves four points without the old variables or a mode token', () => {
		const shapePoints = {
			topLeft: '10px',
			bottomLeft: '35%',
			topRight: '40%',
			bottomRight: '65px',
		};
		const markup = renderSave( save, {
			type: 'backslash-shape',
			shapeSize: { top: '25%', bottom: '25%' },
			shapePoints,
		} );
		expect( markup ).toContain(
			'data-unitone-layout="texture -texture:backslash-shape"'
		);
		expect( markup ).toContain(
			'--unitone--texture-shape-top-left-y:10px'
		);
		expect( markup ).not.toContain( 'texture-band-' );
		expect( markup ).not.toContain( 'shape-points' );
	} );
} );
