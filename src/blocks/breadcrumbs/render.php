<?php
/**
 * @package unitone
 * @author inc2734
 * @license GPL-2.0+
 */

use Inc2734\WP_Breadcrumbs;

$get_breadcrumbs_items = function () {
	$breadcrumbs_items = array();
	if ( $breadcrumbs_items ) {
		return $breadcrumbs_items;
	}

	$breadcrumbs       = new WP_Breadcrumbs\Bootstrap();
	$breadcrumbs_items = apply_filters( 'unitone_breadcrumbs', $breadcrumbs->get() );
	return $breadcrumbs_items;
};

$items = $get_breadcrumbs_items();
$items = array_values( $items );

if ( ! $items ) {
	return;
}

$allowed_html = wp_kses_allowed_html( 'post' );
unset( $allowed_html['a'] );

$classes = array(
	'unitone-breadcrumbs',
);
if ( ! empty( $attributes['divider'] ) ) {
	$classes[] = 'unitone-breadcrumbs--divider:' . $attributes['divider'];
}
if ( ! empty( $attributes['fontSize'] ) ) {
	$classes[] = 'has-' . $attributes['fontSize'] . '-font-size';
}

$block_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => implode( ' ', $classes ),
	)
);
?>
<ol <?php echo wp_kses_data( $block_wrapper_attributes ); ?> itemscope itemtype="http://schema.org/BreadcrumbList">
	<?php foreach ( $items as $key => $item ) : ?>
		<?php
		$is_last_item = (int) count( $items ) - 1 === (int) $key;

		/**
		 * @see https://github.com/WordPress/WordPress/blob/5.4-branch/wp-includes/default-filters.php#L168-L170
		 */
		$_title = wptexturize( $item['title'] );
		$_title = convert_chars( $_title );
		$_title = trim( $_title );
		?>
		<li
			class="unitone-breadcrumbs__item"
			itemprop="itemListElement"
			itemscope
			itemtype="http://schema.org/ListItem"
		>
			<a
				itemscope
				itemtype="http://schema.org/Thing"
				itemprop="item"
				href="<?php echo esc_url( $item['link'] ); ?>"
				itemid="<?php echo esc_url( $item['link'] ); ?>"
				<?php if ( $is_last_item ) : ?>
					aria-current="page"
				<?php endif; ?>
			>
				<span itemprop="name"><?php echo wp_kses( $_title, $allowed_html ); ?></span>
			</a>
			<meta itemprop="position" content="<?php echo esc_attr( $key + 1 ); ?>" />
		</li>
	<?php endforeach; ?>
</ol>
