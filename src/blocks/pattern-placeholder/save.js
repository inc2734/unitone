import { useInnerBlocksProps } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

export default function () {
	return <Fragment { ...useInnerBlocksProps.save() } />;
}
