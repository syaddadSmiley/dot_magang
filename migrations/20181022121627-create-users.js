
query = `CREATE TABLE IF NOT EXISTS users (
    uid VARCHAR(50) NOT NULL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false,
    mobile_number VARCHAR(20) NOT NULL,
    user_img LONGBLOB,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_status enum('0','1') NOT NULL DEFAULT '0'
    );
    `

module.exports = {
	up: query,
	down: (queryInterface, Sequelize) => queryInterface.dropTable('users')
};
