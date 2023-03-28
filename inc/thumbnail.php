<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

function unitone_set_empty_thumbnail( $html ) {
	return ! $html
		? '<div style="background-color: var(--wp--preset--color--unitone-light-gray); aspect-ratio: var(--unitone--ratio)"></div>'
		: $html;
}
add_filter( 'post_thumbnail_html', 'unitone_set_empty_thumbnail' );
