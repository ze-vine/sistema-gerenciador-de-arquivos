import { type Dispatch, type SetStateAction } from 'react';
import type { IUser } from './user';

export interface IAuthContext {
  currentUser: IUser | null;
  setCurrentUser: Dispatch<SetStateAction<any>>;
}