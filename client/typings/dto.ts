export interface ErrorField {
  message: string;
  field?: string;
}

export interface ErrorDto {
  errors: ErrorField[];
}

export interface SignUpDto {
  id: string;
  email: string;
}

export type CurrentUserDto = { id: string; email: string; iat: number } | null;

export interface CurrentUserResponse {
  currentUser: CurrentUserDto;
}
