
query = `CREATE TABLE IF NOT EXISTS users (
    uid VARCHAR(50) NOT NULL PRIMARY KEY,
    created_time DATETIME NOT NULL,
	updated_time DATETIME NOT NULL,
    deleted_status enum('0','1') NOT NULL DEFAULT '0'
    );
    `

module.exports = {
	up: query,
	down: (queryInterface, Sequelize) => queryInterface.dropTable('Users')
};
