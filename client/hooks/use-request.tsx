import axios, { AxiosError } from "axios";
import { useState } from "react";
import { ErrorDto } from "../typings/dto";

interface UseRequestInput<T> {
  url: string;
  method?: "get" | "post" | "put" | "patch" | "delete";
  body?: any;
  onSuccess?: (result: T) => void;
}

export default function useRequest<T = any>({
  url,
  method = "get",
  body,
  onSuccess,
}: UseRequestInput<T>) {
  const [error, setError] = useState<JSX.Element | null>(null);

  async function doRequest() {
    try {
      setError(null);
      const response = await axios[method](url, body);
      const result = response.data as T;
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err) {
      const errors = (err as AxiosError<ErrorDto>).response?.data.errors ?? [];
      const errorJsx = (
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
      setError(errorJsx);
    }
  }

  return { doRequest, error };
}
