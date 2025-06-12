
interface MediaAttachment {
  type: 'image' | 'video';
  data: string;
}

interface ChatMessage {
  id: number;
  customerId: number;
  customerEmail: string;
  message: string;
  timestamp: string;
  isFromCustomer: boolean;
  isRead: boolean;
  adminReply?: string;
  adminReplyTimestamp?: string;
  attachments?: MediaAttachment[];
}

interface AdminMessage {
  id: number;
  customerId: number;
  message: string;
  timestamp: string;
  isFromAdmin: true;
  attachments?: MediaAttachment[];
}

interface ChatSession {
  customerId: number;
  customerEmail: string;
  messages: (ChatMessage | AdminMessage)[];
  lastActivity: string;
  status: 'active' | 'closed' | 'waiting';
  unreadCount: number;
}

class CustomerChatService {
  private static CHAT_MESSAGES_KEY = 'chat_messages';
  private static CHAT_SESSIONS_KEY = 'chat_sessions';
  private static ADMIN_MESSAGES_KEY = 'admin_messages';

  static getChatMessages(): ChatMessage[] {
    try {
      const stored = localStorage.getItem(this.CHAT_MESSAGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('CustomerChatService: Error loading chat messages:', error);
      return [];
    }
  }

  static getAdminMessages(): AdminMessage[] {
    try {
      const stored = localStorage.getItem(this.ADMIN_MESSAGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('CustomerChatService: Error loading admin messages:', error);
      return [];
    }
  }

  static saveChatMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(this.CHAT_MESSAGES_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('CustomerChatService: Error saving chat messages:', error);
    }
  }

  static saveAdminMessages(messages: AdminMessage[]): void {
    try {
      localStorage.setItem(this.ADMIN_MESSAGES_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('CustomerChatService: Error saving admin messages:', error);
    }
  }

  static getChatSessions(): ChatSession[] {
    try {
      const stored = localStorage.getItem(this.CHAT_SESSIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('CustomerChatService: Error loading chat sessions:', error);
      return [];
    }
  }

  static saveChatSessions(sessions: ChatSession[]): void {
    try {
      localStorage.setItem(this.CHAT_SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('CustomerChatService: Error saving chat sessions:', error);
    }
  }

  static sendCustomerMessage(
    customerId: number, 
    customerEmail: string, 
    message: string, 
    attachments?: MediaAttachment[]
  ): boolean {
    try {
      const messages = this.getChatMessages();
      const sessions = this.getChatSessions();
      
      const newMessage: ChatMessage = {
        id: Date.now(),
        customerId,
        customerEmail,
        message,
        timestamp: new Date().toLocaleString('ar-SA'),
        isFromCustomer: true,
        isRead: false,
        attachments: attachments || []
      };

      messages.push(newMessage);
      this.saveChatMessages(messages);

      let session = sessions.find(s => s.customerId === customerId);
      if (session) {
        session.messages.push(newMessage);
        session.lastActivity = newMessage.timestamp;
        session.status = 'waiting';
        session.unreadCount++;
      } else {
        session = {
          customerId,
          customerEmail,
          messages: [newMessage],
          lastActivity: newMessage.timestamp,
          status: 'waiting',
          unreadCount: 1
        };
        sessions.push(session);
      }

      this.saveChatSessions(sessions);
      console.log('CustomerChatService: Customer message sent successfully');
      return true;
    } catch (error) {
      console.error('CustomerChatService: Error sending customer message:', error);
      return false;
    }
  }

  static sendAdminMessage(customerId: number, message: string, attachments?: MediaAttachment[]): boolean {
    try {
      const sessions = this.getChatSessions();
      const adminMessages = this.getAdminMessages();
      
      const newAdminMessage: AdminMessage = {
        id: Date.now(),
        customerId,
        message,
        timestamp: new Date().toLocaleString('ar-SA'),
        isFromAdmin: true,
        attachments: attachments || []
      };

      adminMessages.push(newAdminMessage);
      this.saveAdminMessages(adminMessages);

      const session = sessions.find(s => s.customerId === customerId);
      if (session) {
        session.messages.push(newAdminMessage);
        session.lastActivity = newAdminMessage.timestamp;
        session.status = 'active';
        this.saveChatSessions(sessions);
      }

      console.log('CustomerChatService: Admin message sent successfully');
      return true;
    } catch (error) {
      console.error('CustomerChatService: Error sending admin message:', error);
      return false;
    }
  }

  static sendAdminReply(customerId: number, messageId: number, reply: string): boolean {
    try {
      const messages = this.getChatMessages();
      const sessions = this.getChatSessions();
      
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        messages[messageIndex].adminReply = reply;
        messages[messageIndex].adminReplyTimestamp = new Date().toLocaleString('ar-SA');
        messages[messageIndex].isRead = true;
        this.saveChatMessages(messages);
      }

      const session = sessions.find(s => s.customerId === customerId);
      if (session) {
        const sessionMessageIndex = session.messages.findIndex(m => m.id === messageId);
        if (sessionMessageIndex !== -1) {
          const sessionMessage = session.messages[sessionMessageIndex] as ChatMessage;
          sessionMessage.adminReply = reply;
          sessionMessage.adminReplyTimestamp = new Date().toLocaleString('ar-SA');
          sessionMessage.isRead = true;
        }
        session.lastActivity = new Date().toLocaleString('ar-SA');
        session.status = 'active';
        this.saveChatSessions(sessions);
      }

      console.log('CustomerChatService: Admin reply sent successfully');
      return true;
    } catch (error) {
      console.error('CustomerChatService: Error sending admin reply:', error);
      return false;
    }
  }

  static getCustomerMessages(customerId: number): (ChatMessage | AdminMessage)[] {
    const customerMessages = this.getChatMessages().filter(m => m.customerId === customerId);
    const adminMessages = this.getAdminMessages().filter(m => m.customerId === customerId);
    
    const allMessages = [...customerMessages, ...adminMessages];
    return allMessages.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB;
    });
  }

  static markMessagesAsRead(customerId: number): void {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.customerId === customerId);
    if (session) {
      session.unreadCount = 0;
      this.saveChatSessions(sessions);
    }
  }

  static getTotalUnreadCount(): number {
    const sessions = this.getChatSessions();
    return sessions.reduce((total, session) => total + session.unreadCount, 0);
  }

  static closeSession(customerId: number): void {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.customerId === customerId);
    if (session) {
      session.status = 'closed';
      this.saveChatSessions(sessions);
    }
  }
}

export default CustomerChatService;
export type { ChatMessage, ChatSession, AdminMessage, MediaAttachment };
