export interface UpdateAccountModel {
  name?: string;
  email?: string;
  password?: string;
}

export interface UpdateAccount {
  update(address: UpdateAccountModel, accountId: string): Promise<boolean>;
}
