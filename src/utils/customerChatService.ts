interface MediaAttachment {
  type: 'image' | 'video';
  data: string;
}

interface FileAttachment {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface ChatMessage {
  id: number;
  customerId: string;
  customerEmail: string;
  message: string;
  timestamp: string;
  isFromCustomer: boolean;
  isRead: boolean;
  adminReply?: string;
  adminReplyTimestamp?: string;
  attachments?: MediaAttachment[];
  sender?: 'customer' | 'support';
  files?: FileAttachment[];
}

interface AdminMessage {
  id: number;
  customerId: string;
  message: string;
  timestamp: string;
  isFromAdmin: true;
  attachments?: MediaAttachment[];
  sender: 'support';
  files?: FileAttachment[];
}

interface ChatSession {
  customerId: string;
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

  static getActiveCustomers(): string[] {
    try {
      const sessions = this.getChatSessions();
      return sessions
        .filter(session => session.status === 'active' || session.status === 'waiting')
        .map(session => session.customerId);
    } catch (error) {
      console.error('CustomerChatService: Error getting active customers:', error);
      return [];
    }
  }

  static getMessages(customerId: string): (ChatMessage | AdminMessage)[] {
    try {
      const sessions = this.getChatSessions();
      const session = sessions.find(s => s.customerId === customerId);
      return session ? session.messages : [];
    } catch (error) {
      console.error('CustomerChatService: Error getting messages:', error);
      return [];
    }
  }

  static sendCustomerMessage(
    customerId: string, 
    customerEmail: string, 
    message: string, 
    attachments?: MediaAttachment[]
  ): boolean {
    try {
      const messages = this.getChatMessages();
      const sessions = this.getChatSessions();
      
      // إذا لم يكن هناك نص ولكن توجد مرفقات، استخدم نص افتراضي
      let messageText = message;
      if ((!messageText || messageText.trim() === '') && attachments && attachments.length > 0) {
        const imageCount = attachments.filter(att => att.type === 'image').length;
        const videoCount = attachments.filter(att => att.type === 'video').length;
        
        if (imageCount > 0 && videoCount > 0) {
          messageText = `تم إرسال ${imageCount} صورة و ${videoCount} فيديو`;
        } else if (imageCount > 0) {
          messageText = imageCount === 1 ? 'تم إرسال صورة' : `تم إرسال ${imageCount} صور`;
        } else if (videoCount > 0) {
          messageText = videoCount === 1 ? 'تم إرسال فيديو' : `تم إرسال ${videoCount} فيديوهات`;
        }
      }
      
      const newMessage: ChatMessage = {
        id: Date.now(),
        customerId,
        customerEmail,
        message: messageText,
        timestamp: new Date().toLocaleString('ar-SA'),
        isFromCustomer: true,
        isRead: false,
        attachments: attachments || [],
        sender: 'customer'
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

  static sendAdminMessage(customerId: string, message: string, attachments?: MediaAttachment[], files?: FileAttachment[]): boolean {
    try {
      const sessions = this.getChatSessions();
      const adminMessages = this.getAdminMessages();
      
      // إذا لم يكن هناك نص ولكن توجد مرفقات، استخدم نص افتراضي
      let messageText = message;
      if ((!messageText || messageText.trim() === '') && ((attachments && attachments.length > 0) || (files && files.length > 0))) {
        let mediaCount = 0;
        let fileCount = 0;
        
        if (attachments && attachments.length > 0) {
          const imageCount = attachments.filter(att => att.type === 'image').length;
          const videoCount = attachments.filter(att => att.type === 'video').length;
          mediaCount = imageCount + videoCount;
        }
        
        if (files && files.length > 0) {
          fileCount = files.length;
        }
        
        if (mediaCount > 0 && fileCount > 0) {
          messageText = `تم إرسال ${mediaCount + fileCount} ملف من فريق الدعم`;
        } else if (mediaCount > 0) {
          const imageCount = attachments?.filter(att => att.type === 'image').length || 0;
          const videoCount = attachments?.filter(att => att.type === 'video').length || 0;
          
          if (imageCount > 0 && videoCount > 0) {
            messageText = `تم إرسال ${imageCount} صورة و ${videoCount} فيديو من فريق الدعم`;
          } else if (imageCount > 0) {
            messageText = imageCount === 1 ? 'تم إرسال صورة من فريق الدعم' : `تم إرسال ${imageCount} صور من فريق الدعم`;
          } else if (videoCount > 0) {
            messageText = videoCount === 1 ? 'تم إرسال فيديو من فريق الدعم' : `تم إرسال ${videoCount} فيديوهات من فريق الدعم`;
          }
        } else if (fileCount > 0) {
          messageText = fileCount === 1 ? 'تم إرسال ملف من فريق الدعم' : `تم إرسال ${fileCount} ملفات من فريق الدعم`;
        }
      }
      
      const newAdminMessage: AdminMessage = {
        id: Date.now(),
        customerId,
        message: messageText,
        timestamp: new Date().toLocaleString('ar-SA'),
        isFromAdmin: true,
        attachments: attachments || [],
        sender: 'support',
        files: files || []
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

  static sendAdminReply(customerId: string, messageId: number, reply: string): boolean {
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

  static getCustomerMessages(customerId: string): (ChatMessage | AdminMessage)[] {
    const customerMessages = this.getChatMessages().filter(m => m.customerId === customerId);
    const adminMessages = this.getAdminMessages().filter(m => m.customerId === customerId);
    
    const allMessages = [...customerMessages, ...adminMessages];
    return allMessages.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB;
    });
  }

  static markMessagesAsRead(customerId: string): void {
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

  static closeSession(customerId: string): void {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.customerId === customerId);
    if (session) {
      session.status = 'closed';
      this.saveChatSessions(sessions);
    }
  }

  static deleteCustomerSession(customerId: string): boolean {
    try {
      const sessions = this.getChatSessions();
      const messages = this.getChatMessages();
      const adminMessages = this.getAdminMessages();
      
      // حذف الجلسة من قائمة الجلسات
      const filteredSessions = sessions.filter(session => session.customerId !== customerId);
      this.saveChatSessions(filteredSessions);
      
      // حذف رسائل العميل
      const filteredMessages = messages.filter(message => message.customerId !== customerId);
      this.saveChatMessages(filteredMessages);
      
      // حذف رسائل الإدارة للعميل
      const filteredAdminMessages = adminMessages.filter(message => message.customerId !== customerId);
      this.saveAdminMessages(filteredAdminMessages);
      
      console.log('CustomerChatService: Customer session deleted successfully');
      return true;
    } catch (error) {
      console.error('CustomerChatService: Error deleting customer session:', error);
      return false;
    }
  }
}

export default CustomerChatService;
export type { ChatMessage, ChatSession, AdminMessage, MediaAttachment, FileAttachment };
