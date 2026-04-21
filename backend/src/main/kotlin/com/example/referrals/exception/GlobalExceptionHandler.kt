package com.example.referrals.exception

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

data class ValidationErrorResponse(
    val message: String,
    val errors: List<FieldError>
)

data class FieldError(
    val field: String,
    val message: String
)

data class ErrorResponse(
    val message: String
)

@RestControllerAdvice
class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<ValidationErrorResponse> {
        val fieldErrors = ex.bindingResult.fieldErrors.map {
            FieldError(field = it.field, message = it.defaultMessage ?: "Invalid value")
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ValidationErrorResponse(message = "Validation failed", errors = fieldErrors)
        )
    }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleMalformedJson(ex: HttpMessageNotReadableException): ResponseEntity<ErrorResponse> {
        log.warn("Malformed JSON request: {}", ex.message)
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ErrorResponse(message = "Malformed or unreadable request body")
        )
    }

    @ExceptionHandler(Exception::class)
    fun handleGeneric(ex: Exception): ResponseEntity<ErrorResponse> {
        log.error("Unhandled exception", ex)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ErrorResponse(message = "An unexpected error occurred")
        )
    }
}
