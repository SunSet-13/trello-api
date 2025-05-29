import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  const CorrectCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
        // Các thông báo lỗi tùy chỉnh cho các quy tắc xác thực
      'string.trim': 'Title must not have leading or trailing spaces',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 50 characters',
      'any.required': 'Title is required'
    }),
    description: Joi.string().required().min(3).max(250).trim().strict(),
  })

  try {
    //chỉ định abortEarly: false để trả về tất cả các lỗi validation
    await CorrectCondition.validateAsync(req.body, { abortEarly: false })
    //validation thành công, cho request đi tiếp (trong boardRoute)
    next()
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }
}
export const boardValidation = {
  createNew
}
