const {Op, literal} = require('sequelize');


const postService = require("../services/post.service");

async function validatePostData(postData, postId) {
    const {title, description, link, creator, guid} = postData;
    const errors = {};

    if (!title) {
        errors.title = "Title is required";
    }

    if (!description) {
        errors.description = "Description is required";
    }

    if (!creator) {
        errors.creator = "Creator is required";
    }

    if (!link) {
        errors.link = "Link is required";
    } else if (!/^https?:\/\/\S+$/.test(link)) {
        errors.link = "Invalid URL format";
    }

    if (guid) {
        const existingPost = await postService.findByGuid(guid);
        if (existingPost && existingPost.id != postId) {
            errors.guid = "Guid must be unique";
        }

        if (isNaN(guid)) {
            errors.guid = "Guid must be number";
        }
        const checkGuid = parseInt(guid);
        if (isNaN(checkGuid) || checkGuid > 2147483647) {
            errors.guid = "Invalid guid value. Must be an integer between 0 and 2147483647.";
        }
    }

    return errors;
}

async function create(req, res) {
    try {

        const postData = {
            title: req.body.title,
            description: req.body.description,
            link: req.body.link,
            pub_date: new Date(),
            guid: req.body.guid || null,
            creator: req.body.creator,
        };

        const errors = await validatePostData(postData, null);
        if (Object.keys(errors).length) {
            return res.status(400).json({errors});
        }

        const post = await postService.create(postData);
        res.send(post);
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while creating the Post."
        });
    }
}

async function findAll(req, res) {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const maxLimit = 50;
        if (limit > maxLimit) {
            return res.status(400).send({
                message: `Limit can't be greater than ${maxLimit}.`
            });
        }
        const {title, creator, guid, link, description, field, order} = req.body;

        const filters = {};
        if (title) {
            filters.title = {[Op.like]: `%${title}%`};
        }
        if (description) {
            filters.description = {[Op.like]: `%${description}%`};
        }
        if (creator) {
            filters.creator = {[Op.like]: `%${creator}%`};
        }
        if (guid) {
            filters.guid = {[Op.like]: `%${guid}%`};
        }
        if (link) {
            filters.link = {[Op.like]: `%${link}%`};
        }

        const orderMapping = {
            ascend: 'ASC',
            descend: 'DESC'
        };
        const validOrder = orderMapping[order] || 'ASC';

        const posts = await postService.findAll({
                page,
                limit,
                filters,
                order: [
                    field === 'guid'
                        ? [literal('CAST(post.guid AS INTEGER)'), validOrder]
                        : [field || 'pub_date', validOrder]]
            }
        );
        posts.allCreators = await postService.findAllCreators();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while retrieving posts."
        });
    }
}

async function findOne(req, res) {
    const id = req.params.id;

    try {
        const post = await postService.findById(id);

        if (!post) {
            res.status(404).send({
                message: "Post not found"
            });
            return;
        }

        res.send(post);
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving Post with id=" + id
        });
    }
}

async function update(req, res) {
    const id = req.params.id;

    try {
        const postData = {
            title: req.body.title,
            description: req.body.description,
            link: req.body.link,
            guid: req.body.guid || null,
            creator: req.body.creator,
        };

        const errors = await validatePostData(postData, id);
        if (Object.keys(errors).length) {
            return res.status(400).json({errors});
        }

        const num = await postService.update(id, postData);

        if (num == 1) {
            res.send({
                message: "Post was updated successfully."
            });
        } else {
            res.status(404).send({
                message: `Cannot update Post with id=${id}.`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error updating Post with id=" + id
        });
    }
}

async function deleteById(req, res) {
    const id = req.params.id;
    try {
        const num = await postService.deleteById(id);

        if (num == 1) {
            res.send({
                message: "Post was deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Could not delete Post with id=" + id
        });
    }
}

module.exports = {
    create,
    findAll,
    findOne,
    update,
    deleteById,
};