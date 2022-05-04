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

export interface TicketDto {
  id: string;
  price: number;
  title: string;
  userId: string;
  version: number;
}

export interface OrderDto {
  expiresAt: string;
  id: string;
  status: string;
  ticket: TicketDto;
  userId: string;
  version: number;
}

export interface PaymentDto {
  id: string;
}
