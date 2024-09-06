import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const parseString = ( value ) => {
	value = String( value );
	return null !== value && '' !== value ? value : undefined;
};

export default function ( { attributes } ) {
	const {
		tagName,
		columnsOption,
		columns,
		columnMinWidth,
		gridTemplateColumns,
		columnAutoRepeat,
		mdColumnsOption,
		mdColumns,
		mdColumnMinWidth,
		mdGridTemplateColumns,
		smColumnsOption,
		smColumns,
		smColumnMinWidth,
		smGridTemplateColumns,
		rowsOption,
		rows,
		gridTemplateRows,
		mdRowsOption,
		mdRows,
		mdGridTemplateRows,
		smRowsOption,
		smRows,
		smGridTemplateRows,
	} = attributes;

	const TagName = tagName;

	const styles = {
		'--unitone--columns':
			( 'columns' === columnsOption && parseString( columns ) ) ||
			undefined,
		'--unitone--column-min-width':
			( 'min' === columnsOption && columnMinWidth ) || undefined,
		'--unitone--grid-template-columns':
			( 'free' === columnsOption && gridTemplateColumns ) || undefined,
		'--unitone--column-auto-repeat':
			( 'min' === columnsOption && columnAutoRepeat ) || undefined,
		'--unitone--md-columns':
			( 'columns' === mdColumnsOption && parseString( mdColumns ) ) ||
			undefined,
		'--unitone--md-column-min-width':
			( 'min' === mdColumnsOption && mdColumnMinWidth ) || undefined,
		'--unitone--md-grid-template-columns':
			( 'free' === mdColumnsOption && mdGridTemplateColumns ) ||
			undefined,
		'--unitone--sm-columns':
			( 'columns' === smColumnsOption && parseString( smColumns ) ) ||
			undefined,
		'--unitone--sm-column-min-width':
			( 'min' === smColumnsOption && smColumnMinWidth ) || undefined,
		'--unitone--sm-grid-template-columns':
			( 'free' === smColumnsOption && smGridTemplateColumns ) ||
			undefined,
		'--unitone--rows':
			( 'rows' === rowsOption && parseString( rows ) ) || undefined,
		'--unitone--grid-template-rows':
			( 'free' === rowsOption && gridTemplateRows ) || undefined,
		'--unitone--md-rows':
			( 'rows' === mdRowsOption && parseString( mdRows ) ) || undefined,
		'--unitone--md-grid-template-rows':
			( 'free' === mdRowsOption && mdGridTemplateRows ) || undefined,
		'--unitone--sm-rows':
			( 'rows' === smRowsOption && parseString( smRows ) ) || undefined,
		'--unitone--sm-grid-template-rows':
			( 'free' === smRowsOption && smGridTemplateRows ) || undefined,
	};

	return (
		<TagName
			{ ...useInnerBlocksProps.save( {
				...useBlockProps.save( {
					className: 'unitone-grid',
					style: styles,
					'data-unitone-layout': clsx( {
						[ `-columns:${ columnsOption }` ]: !! columnsOption,
						[ `-columns:md:${ mdColumnsOption }` ]:
							( 'columns' === mdColumnsOption && !! mdColumns ) ||
							( 'min' === mdColumnsOption &&
								!! mdColumnMinWidth ) ||
							( 'free' === mdColumnsOption &&
								!! mdGridTemplateColumns ),
						[ `-columns:sm:${ smColumnsOption }` ]:
							( 'columns' === smColumnsOption && !! smColumns ) ||
							( 'min' === smColumnsOption &&
								!! smColumnMinWidth ) ||
							( 'free' === smColumnsOption &&
								!! smGridTemplateColumns ),
						[ `-rows:${ rowsOption }` ]: !! rowsOption,
						[ `-rows:md:${ mdRowsOption }` ]:
							( 'rows' === mdRowsOption && !! mdRows ) ||
							( 'free' === mdRowsOption &&
								!! mdGridTemplateRows ),
						[ `-rows:sm:${ smRowsOption }` ]:
							( 'rows' === smRowsOption && !! smRows ) ||
							( 'free' === smRowsOption &&
								!! smGridTemplateRows ),
					} ),
				} ),
			} ) }
		/>
	);
}
