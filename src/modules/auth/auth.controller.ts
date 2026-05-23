import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

// Controller function to handle user signup
const signup = catchAsync(async (req, res) => {
  const user = await AuthService.signupUser(req.body);
  //   console.log("Created user:", user);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

// Controller function to handle user login
const login = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});
export const AuthController = {
  signup,
  login
};
