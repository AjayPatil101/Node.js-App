const Article = require("../models/article");

const getArticles = async (req, res) => {
	try {
		const article = await Article.find({
			_id: req.params._id,
			creatorId: req.user._id,
		});
		if (!article) {
			throw new Error("Invalid Article id.");
		}
		res.status(200).send(article);
	} catch (error) {
		res.status(500).send({ error: getErrorMessage(error) });
	}
};

const addArticles = async (req, res) => {
	try {
		const { title, description } = req.body;
		const article = new Article({
			title,
			description,
			creatorId: req.user._id,
		});
		const savedArticle = await article.save();
		res.status(201).send(savedArticle);
	} catch (error) {
		res.status(500).send({ error: getErrorMessage(error) });
	}
};

const removeArticles = async (req, res) => {
	try {
		const deletedArticle = await Article.findOneAndDelete({
			_id: req.params._id,
			creatorId: req.user._id,
		});
		if (!deletedArticle) {
			throw new Error("Invalid Article id.");
		}
		res.send({ message: `${deletedArticle.title} successfully deleted` });
	} catch (error) {
		res.status(500).send({ error: getErrorMessage(error) });
	}
};

const updateArticles = async (req, res) => {
	try {
		const { title, description } = req.body;
		const updatedArticle = await Article.updateOne(
			{ _id: req.params._id, creatorId: req.user._id },
			{
				title,
				description,
				updatedAt: Date.now(),
			}
		);
		if (updatedArticle.matchedCount === 0) {
			throw new Error("Invalid Article Title.");
		}
		res.send({ message: "Article updated successfully." });
	} catch (error) {
		res.status(500).send({ error: getErrorMessage(error) });
	}
};

const paginationArticle = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;
		const sortOrder = req.query.order || "asc";

		const sortDirection = sortOrder === "desc" ? -1 : 1;

		const articles = await Article.find({ creatorId: req.user._id })
			.sort({ title: sortDirection })
			.skip(skip)
			.limit(limit);

		const count = await Article.countDocuments();

		const pages = Math.ceil(count / limit);
		res.json({
			success: true,
			message: "Articles found",
			articles,
			page,
			limit,
			totalPages: pages,
			SelectedRecords: Object.entries(articles).length,
			totalRecords: count,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error occurred",
			error: error.toString(),
		});
	}
};

const SearchArticles = async (req, res) => {
	try {
		const page = req.query.page || 1;
		const limit = req.query.limit || 10;
		const sortOrder = req.query.order || "asc";
		const sortDirection = sortOrder === "desc" ? -1 : 1;

		const data = await Article.find({
			$or: [
				{ title: { $regex: req.params.key } },
				{ description: { $regex: req.params.key } },
			],
		})
			.sort({ title: sortDirection })
			.skip((page - 1) * limit)
			.limit(parseInt(limit));

		const count = await Article.countDocuments({
			$or: [
				{ title: { $regex: req.params.key } },
				{ description: { $regex: req.params.key } },
			],
		});

		const pages = Math.ceil(count / limit);

		res.json({
			success: true,
			message: "Articles found",
			data,
			page,
			limit,
			totalPages: pages,
			SelectedRecords: Object.entries(data).length,
			totalRecords: count,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error occurred",
			error: error.toString(),
		});
	}
};

const getErrorMessage = (error) => {
	return error.message || "Internal Server Error";
};

module.exports = {
	getArticles,
	addArticles,
	updateArticles,
	removeArticles,
	paginationArticle,
	SearchArticles,
};
