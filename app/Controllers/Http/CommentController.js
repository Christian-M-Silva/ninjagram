'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Comment = use('App/Models/Comment')

/**
 * Resourceful controller for interacting with comments
 */
class CommentController {
  /**
   * Show a list of all comments.
   * GET comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, auth }) {
    const commentData = await Comment.all()

    return commentData
  }

  /**
   * Create/save a new comment.
   * POST comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, auth }) {
    const commentData = request.only(['comment'])

    const comment = await Comment.create({ userID: `${auth.user._id}`, ...commentData })

    return comment
  }

  /**
   * Display a single comment.
   * GET comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    const commentData = await Comment.where('userID', params.id).fetch()

    return commentData.toJSON()
  }

  /**
   * Delete a comment with id.
   * DELETE comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, auth, response }) {
    const commentData = await Comment.findByOrFail('_id', params.id)

    if (auth.user._id != commentData.userID) {
      return response.status(401).send({
        message: "Not authorization"
      })
    }

    await commentData.delete()

    return response.status(200).send({
      message: "Destroy this comment"
    })
  }
}

module.exports = CommentController
