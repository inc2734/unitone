<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

/**
 * Filters the post thumbnail HTML.
 *
 * @param string $html The post thumbnail HTML.
 * @return string
 */
function unitone_set_empty_thumbnail( $html ) {
	return ! $html
		? '<div style="background-color: var(--wp--preset--color--unitone-bright-gray); aspect-ratio: var(--unitone--ratio); height: 100%; width: 100%"></div>'
		: $html;
}
add_filter( 'post_thumbnail_html', 'unitone_set_empty_thumbnail' );
