export class ApiError {
    message: string;
    status: number;
    timestamp: Date;

    constructor (message: string, status: number, timestamp: Date) {
        this.message = message;
        this.status = status;
        this.timestamp = timestamp;
    } 

    static unauthorized(message: string) {
        return new ApiError(message, 401, new Date(Date.now()));
    }

    static badRequest(message: string) {
        return new ApiError(message, 400, new Date(Date.now()));
    }

    static internalServerError(message: string) {
        return new ApiError(message, 500, new Date(Date.now()));
    }
}