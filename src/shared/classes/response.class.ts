/* eslint-disable @typescript-eslint/no-explicit-any */
abstract class AResponse<T = any> {
  statusCode: number = 200
  message: string
  data?: T // dùng khi success
  stack?: any // dùng khi error
  constructor({ statusCode, message, data, stack }: { statusCode: number; message: string; data?: T; stack?: any }) {
    this.statusCode = statusCode
    this.message = message
    this.data = data
    this.stack = stack
  }
}

export class OkResponse<T = any> extends AResponse<T> {
  constructor(message = 'OK', data?: T) {
    super({ statusCode: 200, message, data })
  }
}

export class CreatedResponse<T = any> extends AResponse<T> {
  constructor(message = 'Created', data?: T) {
    super({ statusCode: 201, message, data })
  }
}

export class ErrorResponse<T = any> extends AResponse<T> {
  constructor(statusCode: number, message = 'Error', stack?: any) {
    super({ statusCode, message, stack })
  }
}
