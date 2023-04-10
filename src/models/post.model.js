module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        link: {
            type: Sequelize.STRING,
            allowNull: false
        },
        pub_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        guid: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        creator: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });

    return Post;
};