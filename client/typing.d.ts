export interface TransactionType {
  id: string;
  description: string;
  amount: number;
  status: string;
  createdAt: Date;
  senderName: string;
  receiverName: string;
  type: string;
}

export interface TransactionsResponse {
  transactions: {
    page: number;
    totalItems: number;
    results: Array<TransactionsType>;
  };
}

export interface UserType {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  balance: number;
  phoneNumber: string;
  accountNumber: number;
}

export interface ValidateCodeType {
  name: string;
  email: string;
  validationToken: string;
}
