"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PUT = exports.GET = exports.POST = void 0;

var _server = require("next/server");

var _connectMongoDB = require("@/lib/db/connectMongoDB");

var _blog_posts = _interopRequireDefault(require("@/lib/models/blog_posts"));

var _users = _interopRequireDefault(require("@/lib/models/users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var POST = function POST(request) {
  var _ref, postId, userId, content, user, post;

  return regeneratorRuntime.async(function POST$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(request.json());

        case 3:
          _ref = _context.sent;
          postId = _ref.postId;
          userId = _ref.userId;
          content = _ref.content;

          if (!(!postId || !userId || !content)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", _server.NextResponse.json({
            message: "Missing required fields"
          }, {
            status: 400
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap((0, _connectMongoDB.connectMongoDB)());

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(_users["default"].findById(userId));

        case 13:
          user = _context.sent;

          if (user) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", _server.NextResponse.json({
            message: "User not found"
          }, {
            status: 404
          }));

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(_blog_posts["default"].findById(postId));

        case 18:
          post = _context.sent;

          if (post) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("return", _server.NextResponse.json({
            message: "Post not found"
          }, {
            status: 404
          }));

        case 21:
          post.comments.push({
            content: content,
            authorId: userId,
            authorName: user.fullName,
            authorImage: user.image
          });
          _context.next = 24;
          return regeneratorRuntime.awrap(post.save());

        case 24:
          return _context.abrupt("return", _server.NextResponse.json({
            message: "Comment added successfully",
            comment: post.comments[post.comments.length - 1]
          }, {
            status: 201
          }));

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);
          console.error("Error adding comment:", _context.t0);
          return _context.abrupt("return", _server.NextResponse.json({
            message: "Failed to add comment"
          }, {
            status: 500
          }));

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

exports.POST = POST;

var GET = function GET(request) {
  var url, postId, action, commentId, userId, _post, comment, post;

  return regeneratorRuntime.async(function GET$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          url = new URL(request.url);
          postId = url.searchParams.get("postId");
          action = url.searchParams.get("action");
          commentId = url.searchParams.get("commentId");
          userId = url.searchParams.get("userId");

          if (postId) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", _server.NextResponse.json({
            message: "Post ID is required"
          }, {
            status: 400
          }));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap((0, _connectMongoDB.connectMongoDB)());

        case 10:
          if (!(action === "delete" && commentId && userId)) {
            _context2.next = 27;
            break;
          }

          _context2.next = 13;
          return regeneratorRuntime.awrap(_blog_posts["default"].findById(postId));

        case 13:
          _post = _context2.sent;

          if (_post) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", _server.NextResponse.json({
            message: "Post not found"
          }, {
            status: 404
          }));

        case 16:
          comment = _post.comments.id(commentId);

          if (comment) {
            _context2.next = 19;
            break;
          }

          return _context2.abrupt("return", _server.NextResponse.json({
            message: "Comment not found"
          }, {
            status: 404
          }));

        case 19:
          if (!(comment.authorId.toString() === userId || _post.authorId.toString() === userId)) {
            _context2.next = 26;
            break;
          }

          _post.comments.pull({
            _id: commentId
          });

          _context2.next = 23;
          return regeneratorRuntime.awrap(_post.save());

        case 23:
          return _context2.abrupt("return", _server.NextResponse.json({
            message: "Comment deleted successfully"
          }, {
            status: 200
          }));

        case 26:
          return _context2.abrupt("return", _server.NextResponse.json({
            message: "Unauthorized to delete this comment"
          }, {
            status: 403
          }));

        case 27:
          _context2.next = 29;
          return regeneratorRuntime.awrap(_blog_posts["default"].findById(postId));

        case 29:
          post = _context2.sent;

          if (post) {
            _context2.next = 32;
            break;
          }

          return _context2.abrupt("return", _server.NextResponse.json({
            message: "Post not found"
          }, {
            status: 404
          }));

        case 32:
          return _context2.abrupt("return", _server.NextResponse.json({
            comments: post.comments
          }, {
            status: 200
          }));

        case 35:
          _context2.prev = 35;
          _context2.t0 = _context2["catch"](0);
          console.error("Error handling comments:", _context2.t0);
          return _context2.abrupt("return", _server.NextResponse.json({
            message: "Failed to process comment request"
          }, {
            status: 500
          }));

        case 39:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 35]]);
};

exports.GET = GET;

var PUT = function PUT(request, _ref2) {
  var params, _ref3, userId, commentId, content, url, postId, post, comment;

  return regeneratorRuntime.async(function PUT$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          params = _ref2.params;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(request.json());

        case 4:
          _ref3 = _context3.sent;
          userId = _ref3.userId;
          commentId = _ref3.commentId;
          content = _ref3.content;
          url = new URL(request.url);
          postId = url.searchParams.get("postId");

          if (!(!postId || !userId || !commentId || !content)) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", _server.NextResponse.json({
            message: "Missing required fields"
          }, {
            status: 400
          }));

        case 12:
          _context3.next = 14;
          return regeneratorRuntime.awrap((0, _connectMongoDB.connectMongoDB)());

        case 14:
          _context3.next = 16;
          return regeneratorRuntime.awrap(_blog_posts["default"].findById(postId));

        case 16:
          post = _context3.sent;

          if (post) {
            _context3.next = 19;
            break;
          }

          return _context3.abrupt("return", _server.NextResponse.json({
            message: "Post not found"
          }, {
            status: 404
          }));

        case 19:
          comment = post.comments.id(commentId);

          if (comment) {
            _context3.next = 22;
            break;
          }

          return _context3.abrupt("return", _server.NextResponse.json({
            message: "Comment not found"
          }, {
            status: 404
          }));

        case 22:
          if (!(comment.authorId.toString() !== userId)) {
            _context3.next = 24;
            break;
          }

          return _context3.abrupt("return", _server.NextResponse.json({
            message: "Unauthorized: Only the comment owner can edit this comment"
          }, {
            status: 403
          }));

        case 24:
          comment.content = content;
          _context3.next = 27;
          return regeneratorRuntime.awrap(post.save());

        case 27:
          return _context3.abrupt("return", _server.NextResponse.json({
            message: "Comment updated successfully",
            comment: comment
          }, {
            status: 200
          }));

        case 30:
          _context3.prev = 30;
          _context3.t0 = _context3["catch"](1);
          console.error("Error updating comment:", _context3.t0);
          return _context3.abrupt("return", _server.NextResponse.json({
            message: "Failed to update comment"
          }, {
            status: 500
          }));

        case 34:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 30]]);
};

exports.PUT = PUT;