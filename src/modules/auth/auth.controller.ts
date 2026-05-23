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

export const AuthController = {
  signup,
};
