import {
	create,
	insert,
	RichTextData,
	toHTMLString,
} from '@wordpress/rich-text';

export const isRichTextValue = ( value ) => {
	return (
		!! value &&
		'object' === typeof value &&
		'string' === typeof value.text &&
		Array.isArray( value.formats ) &&
		Array.isArray( value.replacements )
	);
};

export const isRichTextData = ( value ) => value instanceof RichTextData;

const toRichTextValue = ( value ) => {
	if ( isRichTextValue( value ) ) {
		return value;
	}

	if ( isRichTextData( value ) ) {
		return create( { html: value } );
	}

	if ( 'string' === typeof value ) {
		return create( { text: value } );
	}

	return null;
};

export const insertRichText = ( {
	text,
	lastRichTextTarget,
	getBlock,
	updateBlockAttributes,
} ) => {
	if ( ! lastRichTextTarget ) {
		return false;
	}

	const block = getBlock( lastRichTextTarget.clientId );
	if ( ! block ) {
		return false;
	}

	const currentValue = block.attributes?.[ lastRichTextTarget.attributeKey ];

	if (
		! isRichTextValue( currentValue ) &&
		! isRichTextData( currentValue ) &&
		'string' !== typeof currentValue
	) {
		return false;
	}

	const richTextValue = toRichTextValue( currentValue );
	if ( ! richTextValue ) {
		return false;
	}

	const endIndex = richTextValue.text.length;
	const nextValue = insert( richTextValue, text, endIndex, endIndex );

	if ( isRichTextData( currentValue ) ) {
		updateBlockAttributes( lastRichTextTarget.clientId, {
			[ lastRichTextTarget.attributeKey ]: new RichTextData( nextValue ),
		} );

		return true;
	}

	if ( 'string' === typeof currentValue ) {
		updateBlockAttributes( lastRichTextTarget.clientId, {
			[ lastRichTextTarget.attributeKey ]: toHTMLString( {
				value: nextValue,
			} ),
		} );
		return true;
	}

	updateBlockAttributes( lastRichTextTarget.clientId, {
		[ lastRichTextTarget.attributeKey ]: nextValue,
	} );

	return true;
};
