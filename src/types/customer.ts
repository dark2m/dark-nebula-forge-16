
export interface CustomerUser {
  id: number;
  email: string;
  password: string;
  username?: string;
  registrationDate: string;
  createdAt: string;
  isVerified: boolean;
  isBlocked?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface LoginAttempt {
  id: number;
  email: string;
  password: string;
  timestamp: string;
  success: boolean;
  ipAddress: string;
}
