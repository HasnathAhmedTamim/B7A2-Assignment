import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AuthService } from "./auth.service.js";
import { MESSAGES } from "../../constants/messages.js";
// Controller function to handle user signup
const signup = catchAsync(async (req, res) => {
  const user = await AuthService.signupUser(req.body);
  //   console.log("Created user:", user);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: MESSAGES.AUTH.USER_REGISTERED,
    data: user,
  });
});

// Controller function to handle user login
const login = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: MESSAGES.AUTH.LOGIN_SUCCESS,
    data: result,
  });
});
export const AuthController = {
  signup,
  login
};
