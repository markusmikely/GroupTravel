<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */


// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'xpozure');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '.Tqox-C17.`;R3w_ZXul]?Pnt@lK:QcH}$;ivZxe.X/8[/!q[yYv.oeW=|e4mfxQ');
define('SECURE_AUTH_KEY',  'N8(ru,=y:PC%,Ux!M@j5v>nH3Vn$.x{YR`T.H*7anksMxx2W0!2`P?}4Rs3EqtBz');
define('LOGGED_IN_KEY',    ':F*x ?buTo[q`SJUqpsg7L+c_?`$&Z^6RUO%Op,77vF80Mkap}oavztg{&Tc8Ws;');
define('NONCE_KEY',        'BOe0xfrMi*Nt?Mve!4[uXK-R$d.w:?KYtD>OYmLmE%n)Pi)x[k%yZ0Dg)%B,<?7r');
define('AUTH_SALT',        '*`y&2FcDTA&<l1tpC;qBz/Ucuap0+ro8/)3gXj=mqFftG|_;Qy<| IBJWk [R[@0');
define('SECURE_AUTH_SALT', 'vmj>)s|PHMmViGbB#RKpYBMZeCynN<P{,!DLJ9>H!W3hkwFW.(T5uJ )}[d 6]j9');
define('LOGGED_IN_SALT',   '5&=j6=I#8=dFi_}WPH5e>~q@W^k]jco=oW_#oXS!mA6pN0]<VK15%4r.mM%#++_F');
define('NONCE_SALT',       'Dxbp>bAWn>gNg,wO`voSdIvkeKTMB?z=K*/iPqw*dk{DJgDXN8:El;&RYMq7aU:^');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
