
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface CustomerSupportUser {
  id: string;
  email: string;
  username?: string;
  password_hash?: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  is_blocked: boolean;
  last_login?: string;
  verification_code?: string;
  verification_expires_at?: string;
}

export interface CustomerSupportMessage {
  id: string;
  customer_id: string;
  message: string;
  attachments: any[];
  files: any[];
  is_from_customer: boolean;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerSupportSession {
  id: string;
  customer_id: string;
  status: 'active' | 'closed' | 'waiting';
  last_activity: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerLoginAttempt {
  id: string;
  email: string;
  ip_address?: string;
  success: boolean;
  attempted_at: string;
  user_agent?: string;
}

// Helper function to convert Json to array
const jsonToArray = (json: Json): any[] => {
  if (Array.isArray(json)) return json;
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// Helper function to ensure valid status
const normalizeStatus = (status: string): 'active' | 'closed' | 'waiting' => {
  if (status === 'active' || status === 'closed' || status === 'waiting') {
    return status;
  }
  return 'active'; // default fallback
};

// Helper function to convert database row to CustomerSupportMessage
const convertToMessage = (row: any): CustomerSupportMessage => ({
  id: row.id,
  customer_id: row.customer_id,
  message: row.message,
  attachments: jsonToArray(row.attachments),
  files: jsonToArray(row.files),
  is_from_customer: row.is_from_customer,
  is_read: row.is_read,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

// Helper function to convert database row to CustomerSupportSession
const convertToSession = (row: any): CustomerSupportSession => ({
  id: row.id,
  customer_id: row.customer_id,
  status: normalizeStatus(row.status),
  last_activity: row.last_activity,
  unread_count: row.unread_count,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

class SupabaseCustomerSupportService {
  // Get all customers
  static async getCustomers(): Promise<CustomerSupportUser[]> {
    const { data, error } = await supabase
      .from('customer_support_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }

    return data as CustomerSupportUser[];
  }

  // Create a new customer
  static async createCustomer(customerData: {
    email: string;
    username?: string;
    password_hash?: string;
    is_verified?: boolean;
  }): Promise<CustomerSupportUser | null> {
    const { data, error } = await supabase
      .from('customer_support_users')
      .insert([customerData])
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      throw error;
    }

    return data as CustomerSupportUser;
  }

  // Update customer
  static async updateCustomer(id: string, updates: Partial<CustomerSupportUser>): Promise<boolean> {
    const { error } = await supabase
      .from('customer_support_users')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating customer:', error);
      throw error;
    }

    return true;
  }

  // Delete customer
  static async deleteCustomer(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('customer_support_users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }

    return true;
  }

  // Send message
  static async sendMessage(messageData: {
    customer_id: string;
    message: string;
    attachments?: any[];
    files?: any[];
    is_from_customer?: boolean;
  }): Promise<CustomerSupportMessage | null> {
    // First, insert the message
    const { data: messageRow, error: messageError } = await supabase
      .from('customer_support_messages')
      .insert([{
        customer_id: messageData.customer_id,
        message: messageData.message,
        attachments: JSON.stringify(messageData.attachments || []),
        files: JSON.stringify(messageData.files || []),
        is_from_customer: messageData.is_from_customer ?? true,
      }])
      .select()
      .single();

    if (messageError) {
      console.error('Error sending message:', messageError);
      throw messageError;
    }

    // Update or create session
    const { data: existingSession } = await supabase
      .from('customer_support_sessions')
      .select('*')
      .eq('customer_id', messageData.customer_id)
      .single();

    if (existingSession) {
      // Update existing session
      await supabase
        .from('customer_support_sessions')
        .update({
          last_activity: new Date().toISOString(),
          unread_count: messageData.is_from_customer ? existingSession.unread_count + 1 : existingSession.unread_count,
        })
        .eq('customer_id', messageData.customer_id);
    } else {
      // Create new session
      await supabase
        .from('customer_support_sessions')
        .insert([{
          customer_id: messageData.customer_id,
          status: 'active',
          unread_count: messageData.is_from_customer ? 1 : 0,
        }]);
    }

    return convertToMessage(messageRow);
  }

  // Get messages for a customer
  static async getMessages(customerId: string): Promise<CustomerSupportMessage[]> {
    const { data, error } = await supabase
      .from('customer_support_messages')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return data.map(convertToMessage);
  }

  // Mark messages as read
  static async markMessagesAsRead(customerId: string): Promise<boolean> {
    const { error } = await supabase
      .from('customer_support_messages')
      .update({ is_read: true })
      .eq('customer_id', customerId)
      .eq('is_from_customer', true);

    if (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }

    // Reset unread count in session
    await supabase
      .from('customer_support_sessions')
      .update({ unread_count: 0 })
      .eq('customer_id', customerId);

    return true;
  }

  // Get all sessions
  static async getSessions(): Promise<CustomerSupportSession[]> {
    const { data, error } = await supabase
      .from('customer_support_sessions')
      .select('*')
      .order('last_activity', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }

    return data.map(convertToSession);
  }

  // Close session
  static async closeSession(customerId: string): Promise<boolean> {
    const { error } = await supabase
      .from('customer_support_sessions')
      .update({ status: 'closed' })
      .eq('customer_id', customerId);

    if (error) {
      console.error('Error closing session:', error);
      throw error;
    }

    return true;
  }

  // Delete session
  static async deleteSession(customerId: string): Promise<boolean> {
    const { error } = await supabase
      .from('customer_support_sessions')
      .delete()
      .eq('customer_id', customerId);

    if (error) {
      console.error('Error deleting session:', error);
      throw error;
    }

    return true;
  }

  // Get login attempts
  static async getLoginAttempts(): Promise<CustomerLoginAttempt[]> {
    const { data, error } = await supabase
      .from('customer_login_attempts')
      .select('*')
      .order('attempted_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching login attempts:', error);
      throw error;
    }

    return data as CustomerLoginAttempt[];
  }

  // Authenticate customer
  static async authenticateCustomer(email: string, password: string): Promise<{
    success: boolean;
    customer?: CustomerSupportUser;
    error?: string;
  }> {
    // Log the attempt
    await supabase
      .from('customer_login_attempts')
      .insert([{
        email,
        success: false,
        ip_address: 'unknown',
        user_agent: navigator.userAgent,
      }]);

    // Find customer by email
    const { data: customer, error } = await supabase
      .from('customer_support_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !customer) {
      return { success: false, error: 'Customer not found' };
    }

    // Check if customer is blocked
    if (customer.is_blocked) {
      return { success: false, error: 'Customer is blocked' };
    }

    // Simple password check (in real app, use proper hashing)
    if (customer.password_hash === password) {
      // Update last login
      await supabase
        .from('customer_support_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', customer.id);

      // Log successful attempt
      await supabase
        .from('customer_login_attempts')
        .insert([{
          email,
          success: true,
          ip_address: 'unknown',
          user_agent: navigator.userAgent,
        }]);

      return { success: true, customer: customer as CustomerSupportUser };
    }

    return { success: false, error: 'Invalid password' };
  }
}

export default SupabaseCustomerSupportService;
