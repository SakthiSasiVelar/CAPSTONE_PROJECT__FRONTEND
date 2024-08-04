export function formatSuccessMessage(code , successMessage , setData){
    return {
        status :'success',
        statusCode : code,
        message : successMessage,
        data : setData
    }
}


export function formatErrorMessage(code , errorMessage){
    return {
       status : 'error',
       errorCode : code,
       message : errorMessage
    }
}