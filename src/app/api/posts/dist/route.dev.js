"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DELETE = exports.GET = exports.POST = void 0;

var _server = require("next/server");

var _connectMongoDB = require("@/lib/db/connectMongoDB");

var _blog_posts = _interopRequireDefault(require("@/lib/models/blog_posts"));

var _users = _interopRequireDefault(require("@/lib/models/users"));

var _promises = require("fs/promises");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var POST = function POST(request) {
  var formData, title, description, image, authorId, authorImage, authorName, category, userExists, imageType, imageName, timeStamp, imageBuffer, buffer, path, imageUrl, newPost;
  return regeneratorRuntime.async(function POST$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connectMongoDB.connectMongoDB)());

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(request.formData());

        case 5:
          formData = _context.sent;
          title = formData.get("title");
          description = formData.get("description");
          image = formData.get("image");
          authorId = formData.get("authorId");
          authorImage = formData.get("authorImage");
          authorName = formData.get("authorName");
          category = formData.get("category");

          if (!(!title || !description || !image || !authorId || !authorImage || !authorName || !category)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", _server.NextResponse.json({
            message: "Some infos are missing"
          }, {
            status: 400
          }));

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(_users["default"].findById(authorId));

        case 17:
          userExists = _context.sent;

          if (userExists) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", _server.NextResponse.json({
            message: "Author not found"
          }, {
            status: 404
          }));

        case 20:
          imageType = image.type;
          imageName = image.name;
          timeStamp = Date.now();
          _context.next = 25;
          return regeneratorRuntime.awrap(image.arrayBuffer());

        case 25:
          imageBuffer = _context.sent;
          buffer = Buffer.from(imageBuffer);
          path = "./public/".concat(timeStamp, "_").concat(imageName);
          _context.next = 30;
          return regeneratorRuntime.awrap((0, _promises.writeFile)(path, buffer));

        case 30:
          imageUrl = "/".concat(timeStamp, "_").concat(imageName);
          console.log(imageUrl);
          _context.next = 34;
          return regeneratorRuntime.awrap(_blog_posts["default"].create({
            title: title,
            description: description,
            imageUrl: imageUrl,
            authorId: authorId,
            authorImage: authorImage,
            authorName: authorName,
            category: category
          }));

        case 34:
          newPost = _context.sent;
          return _context.abrupt("return", _server.NextResponse.json({
            message: 'Post created successfully',
            newPost: newPost
          }, {
            status: 201
          }));

        case 38:
          _context.prev = 38;
          _context.t0 = _context["catch"](0);
          console.error("Error creating post:", _context.t0);
          return _context.abrupt("return", _server.NextResponse.json({
            message: _context.t0.message
          }, {
            status: 500
          }));

        case 42:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 38]]);
};

exports.POST = POST;

var GET = function GET(request) {
  var posts;
  return regeneratorRuntime.async(function GET$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _connectMongoDB.connectMongoDB)());

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(_blog_posts["default"].find());

        case 5:
          posts = _context2.sent;
          return _context2.abrupt("return", _server.NextResponse.json(posts));

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error("Error fetching posts:", _context2.t0);
          return _context2.abrupt("return", _server.NextResponse.json({
            message: _context2.t0.message
          }, {
            status: 500
          }));

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.GET = GET;

var DELETE = function DELETE(request) {
  var url, id, userId, post;
  return regeneratorRuntime.async(function DELETE$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          url = new URL(request.url);
          id = url.searchParams.get("id");
          userId = url.searchParams.get("userId");

          if (id) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", _server.NextResponse.json({
            message: "Post ID not found"
          }, {
            status: 400
          }));

        case 6:
          if (userId) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", _server.NextResponse.json({
            message: "User ID required"
          }, {
            status: 401
          }));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap((0, _connectMongoDB.connectMongoDB)());

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(_blog_posts["default"].findById(id));

        case 12:
          post = _context3.sent;

          if (post) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", _server.NextResponse.json({
            message: "Post not found"
          }, {
            status: 404
          }));

        case 15:
          if (!(post.authorId.toString() !== userId)) {
            _context3.next = 17;
            break;
          }

          return _context3.abrupt("return", _server.NextResponse.json({
            message: "Unauthorized: Only the owner can delete this post"
          }, {
            status: 403
          }));

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(_blog_posts["default"].findByIdAndDelete(id));

        case 19:
          return _context3.abrupt("return", _server.NextResponse.json({
            message: "Post deleted successfully"
          }, {
            status: 200
          }));

        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](0);
          console.error("Error deleting post:", _context3.t0);
          return _context3.abrupt("return", _server.NextResponse.json({
            message: _context3.t0.message
          }, {
            status: 500
          }));

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

exports.DELETE = DELETE;