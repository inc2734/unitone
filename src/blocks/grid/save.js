import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const {
		tagName,
		columnsOption,
		columns,
		columnMinWidth,
		columnAutoRepeat,
		gridTemplateColumns,
		rowsOption,
		rows,
		gridTemplateRows,
	} = attributes;

	const TagName = tagName;

	const styles = {
		'--unitone--columns':
			( 'columns' === columnsOption && String( columns ) ) || undefined,
		'--unitone--column-min-width':
			( 'min' === columnsOption && columnMinWidth ) || undefined,
		'--unitone--column-auto-repeat':
			( 'min' === columnsOption && columnAutoRepeat ) || undefined,
		'--unitone--grid-template-columns':
			( 'free' === columnsOption && gridTemplateColumns ) || undefined,
		'--unitone--rows':
			( 'rows' === rowsOption && String( rows ) ) || undefined,
		'--unitone--grid-template-rows':
			( 'free' === rowsOption && gridTemplateRows ) || undefined,
	};

	return (
		<TagName
			{ ...useInnerBlocksProps.save( {
				...useBlockProps.save( {
					className: 'unitone-grid',
					style: styles,
					'data-unitone-layout': classnames( {
						[ `-columns:${ columnsOption }` ]: !! columnsOption,
						[ `-rows:${ rowsOption }` ]: !! rowsOption,
					} ),
				} ),
			} ) }
		/>
	);
}
