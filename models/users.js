

module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define('users', {
		uid: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		verified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		mobile_number: {
			type: DataTypes.STRING,
		},
		user_img: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		createdAt:
		{
			type: DataTypes.DATE, field: 'created_at',
		},
		updatedAt: {
			type: DataTypes.DATE, field: 'updated_at',
		},
		deleted_status: {
			type: DataTypes.STRING,
		},

	}, {});
	Users.associate = function (models) {
		Users.hasMany(models.Roles, {
			foreignKey: 'role_id',
		});
	};
	return Users;
};
