import axios from 'axios';
import { toast } from 'react-toastify';
import { ApiResponse } from '../entities/ApiResponse';
export class GenericService {
  public static handleError<T>(error: any): ApiResponse<T> {
    let response: ApiResponse<T> = {
      HttpCode: 500,
      HasError: true,
      Message: "Error desconocido. Por favor, intenta nuevamente.",
      errorCode: -1,
      Result: {} as T,
    };

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Manejo de error 401 (no autorizado) y 400 (Error del usuario Posible token)
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        const message = "Sesión expirada. Por favor, inicia sesión nuevamente.";
        toast.error(message);
        response = {
          HttpCode: 401,
          HasError: true,
          Message: message,
          errorCode: 401,
          Result: {} as T,
        };
      } else if (error.response?.data?.Message) {
        const message = error.response.data.Message;
        toast.error(message);
        response = {
          HttpCode: error.response.status || 500,
          HasError: true,
          Message: message,
          errorCode: error.response.data?.errorCode || -1,
          Result: {} as T,
        };
      } else {
        const message = "Error al procesar la solicitud.";
        toast.error(message);
        response = {
          HttpCode: error.response?.status || 500,
          HasError: true,
          Message: message,
          errorCode: -1,
          Result: {} as T,
        };
      }
    } else {
      const message = "Error desconocido. Por favor, intenta nuevamente.";
      toast.error(message);
      response = {
        HttpCode: 500,
        HasError: true,
        Message: message,
        errorCode: -1,
        Result: {} as T,
      };
    }

    return response;
  }
}