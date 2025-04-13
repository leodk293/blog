"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET = exports.POST = void 0;

var _server = require("next/server");

var _connectMongoDB = require("@/lib/db/connectMongoDB");

var _emails = _interopRequireDefault(require("@/lib/models/emails"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var POST = function POST(request) {
  var _ref, userName, userEmail, isEmailExists;

  return regeneratorRuntime.async(function POST$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connectMongoDB.connectMongoDB)());

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(request.json());

        case 5:
          _ref = _context.sent;
          userName = _ref.userName;
          userEmail = _ref.userEmail;
          _context.next = 10;
          return regeneratorRuntime.awrap(_emails["default"].findOne({
            userEmail: userEmail
          }));

        case 10:
          isEmailExists = _context.sent;

          if (!isEmailExists) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", _server.NextResponse.json({
            message: "Email already exists"
          }));

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(_emails["default"].create({
            userName: userName,
            userEmail: userEmail
          }));

        case 15:
          return _context.abrupt("return", _server.NextResponse.json({
            message: "Email saved successfully"
          }, {
            status: 201
          }));

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", _server.NextResponse.json({
            message: "Error saving email"
          }, {
            status: 500
          }));

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

exports.POST = POST;

var GET = function GET(request) {
  var emails;
  return regeneratorRuntime.async(function GET$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _connectMongoDB.connectMongoDB)());

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(_emails["default"].find());

        case 5:
          emails = _context2.sent;
          return _context2.abrupt("return", _server.NextResponse.json(emails));

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", _server.NextResponse.status(500).json({
            message: "Error fetching emails"
          }));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.GET = GET;