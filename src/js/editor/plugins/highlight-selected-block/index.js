import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

const highlightSelectedBlock = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const { isSelected } = props;

			return (
				<BlockListBlock
					{ ...props }
					className={ isSelected ? 'is-highlighted' : undefined }
				/>
			);
		};
	},
	'highlightSelectedBlock'
);

addFilter(
	'editor.BlockListBlock',
	'unitone/highlight-selected-block',
	highlightSelectedBlock
);
