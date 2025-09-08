import { io, Socket } from 'socket.io-client';
import { CollaborationSession, Participant, Message, Decision } from '@/types/sandbox';

export class CollaborationService {
  private socket: Socket | null = null;
  private sessionId: string | null = null;
  private currentUser: Participant | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(sessionId: string, user: Participant): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.sessionId = sessionId;
        this.currentUser = user;
        
        // In a real application, you would connect to your Socket.IO server
        // For demo purposes, we'll simulate the connection
        this.socket = {
          emit: (event: string, data: any) => {
            console.log('Socket emit:', event, data);
            this.simulateServerResponse(event, data);
          },
          on: (event: string, callback: Function) => {
            if (!this.listeners.has(event)) {
              this.listeners.set(event, []);
            }
            this.listeners.get(event)!.push(callback);
          },
          off: (event: string, callback?: Function) => {
            if (callback) {
              const listeners = this.listeners.get(event) || [];
              const index = listeners.indexOf(callback);
              if (index > -1) {
                listeners.splice(index, 1);
              }
            } else {
              this.listeners.delete(event);
            }
          },
          disconnect: () => {
            this.listeners.clear();
            this.socket = null;
            this.sessionId = null;
            this.currentUser = null;
          },
        } as any;

        // Simulate connection success
        setTimeout(() => {
          this.emit('user-connected', user);
          resolve();
        }, 100);

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Event handling
  on(event: string, callback: Function): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: Function): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  private emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Collaboration features
  sendMessage(content: string): void {
    if (!this.currentUser || !this.sessionId) return;

    const message: Message = {
      id: this.generateId(),
      participantId: this.currentUser.id,
      content,
      timestamp: new Date(),
      type: 'text',
    };

    this.emit('message', message);
  }

  makeDecision(type: string, value: any, rationale?: string): void {
    if (!this.currentUser || !this.sessionId) return;

    const decision: Decision = {
      id: this.generateId(),
      participantId: this.currentUser.id,
      type,
      value,
      timestamp: new Date(),
      rationale,
    };

    this.emit('decision', decision);
  }

  updateSimulationParameter(parameter: string, value: any): void {
    if (!this.currentUser || !this.sessionId) return;

    this.emit('parameter-update', {
      participantId: this.currentUser.id,
      parameter,
      value,
      timestamp: new Date(),
    });
  }

  shareScreen(enabled: boolean): void {
    if (!this.currentUser || !this.sessionId) return;

    this.emit('screen-share', {
      participantId: this.currentUser.id,
      enabled,
      timestamp: new Date(),
    });
  }

  requestPresentation(title: string): void {
    if (!this.currentUser || !this.sessionId) return;

    this.emit('presentation-request', {
      participantId: this.currentUser.id,
      title,
      timestamp: new Date(),
    });
  }

  // Cursor sharing for real-time collaboration
  updateCursor(x: number, y: number, element?: string): void {
    if (!this.currentUser || !this.sessionId) return;

    this.emit('cursor-update', {
      participantId: this.currentUser.id,
      x,
      y,
      element,
      timestamp: new Date(),
    });
  }

  // Annotation features
  addAnnotation(x: number, y: number, text: string, type: 'note' | 'question' | 'highlight' = 'note'): void {
    if (!this.currentUser || !this.sessionId) return;

    const annotation = {
      id: this.generateId(),
      participantId: this.currentUser.id,
      x,
      y,
      text,
      type,
      timestamp: new Date(),
    };

    this.emit('annotation-add', annotation);
  }

  removeAnnotation(annotationId: string): void {
    if (!this.currentUser || !this.sessionId) return;

    this.emit('annotation-remove', {
      annotationId,
      participantId: this.currentUser.id,
      timestamp: new Date(),
    });
  }

  // Session management
  getSessionInfo(): Promise<CollaborationSession | null> {
    return new Promise((resolve) => {
      if (!this.sessionId) {
        resolve(null);
        return;
      }

      // Simulate API call
      setTimeout(() => {
        const session: CollaborationSession = {
          id: this.sessionId!,
          simulationId: 'sim_123',
          participants: [
            {
              id: 'user1',
              name: '张明',
              role: 'owner',
              avatar: '/avatars/user1.jpg',
              isOnline: true,
            },
            {
              id: 'user2',
              name: '李华',
              role: 'contributor',
              avatar: '/avatars/user2.jpg',
              isOnline: true,
            },
            {
              id: 'user3',
              name: '王芳',
              role: 'viewer',
              avatar: '/avatars/user3.jpg',
              isOnline: false,
            },
          ],
          messages: [],
          decisions: [],
          createdAt: new Date(),
        };

        resolve(session);
      }, 200);
    });
  }

  inviteParticipant(email: string, role: 'contributor' | 'viewer' = 'viewer'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.sessionId) {
        reject(new Error('No active session'));
        return;
      }

      this.emit('invite-participant', {
        email,
        role,
        sessionId: this.sessionId,
        inviterId: this.currentUser?.id,
      });

      // Simulate success
      setTimeout(resolve, 500);
    });
  }

  // Utility methods
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private simulateServerResponse(event: string, data: any): void {
    // Simulate server responses for demo purposes
    setTimeout(() => {
      const listeners = this.listeners.get(`${event}-response`) || [];
      listeners.forEach(callback => callback(data));

      // Simulate broadcasting to other participants
      if (['message', 'decision', 'parameter-update'].includes(event)) {
        const broadcastListeners = this.listeners.get('broadcast') || [];
        broadcastListeners.forEach(callback => callback({ event, data }));
      }
    }, 50);
  }
}

// Singleton instance
export const collaborationService = new CollaborationService();