import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';

/**
 * Dispatches an in-app and queued email/SMS notification to parents
 */
export async function dispatchParentNotification({
  recipientUid,
  parentEmail,
  parentPhone,
  title,
  message,
  type = 'general', // 'deadline' | 'waiver' | 'rsvp' | 'attendance' | 'broadcast' | 'homework'
  priority = 'normal', // 'urgent' | 'high' | 'normal'
  actionUrl = '/#parent-tasks',
  metadata = {}
}) {
  try {
    const notificationDoc = {
      recipientUid: recipientUid || null,
      parentEmail: parentEmail || null,
      parentPhone: parentPhone || null,
      title,
      message,
      type,
      priority,
      actionUrl,
      read: false,
      metadata,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    };

    // 1. Write to in-app parent notifications feed
    const notifRef = await addDoc(collection(db, 'parent_notifications'), notificationDoc);

    // 2. Queue for Firebase Trigger Email / SendGrid extension if email present
    if (parentEmail) {
      await addDoc(collection(db, 'mail'), {
        to: [parentEmail],
        message: {
          subject: `[Dhulfiqār Scouts Alert] ${title}`,
          text: `${message}\n\nAccess your Parent Portal: https://taliat-app.web.app${actionUrl}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #ffffff;">
              <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 16px; border-radius: 8px; color: #ffffff; text-align: center;">
                <h2 style="margin: 0; font-size: 20px;">Dhulfiqār Scouts BSA</h2>
                <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Taliʿa Parent Notification Center</p>
              </div>
              <div style="padding: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">${title}</h3>
                <p style="color: #475569; font-size: 14px; line-height: 1.6;">${message}</p>
                <div style="margin: 25px 0; text-align: center;">
                  <a href="https://taliat-app.web.app" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                    Open Parent Action Center &rarr;
                  </a>
                </div>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
                Dhulfiqār Troop 313 &bull; Automated Family Safety & Advancement Notification Pipeline
              </div>
            </div>
          `
        }
      });
    }

    return notifRef.id;
  } catch (err) {
    console.warn("Notification dispatch fallback:", err);
    return null;
  }
}

/**
 * Dispatches an automated chat alert into a patrol's messaging room
 */
export async function dispatchPatrolStreamAlert(roomId, text) {
  if (!roomId || !text) return;
  try {
    const messageDoc = {
      senderId: 'system_bot',
      senderName: '⚜️ Troop Bot',
      senderRole: 'system',
      text,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
      isSystemAlert: true
    };
    await addDoc(collection(db, 'chats', roomId, 'messages'), messageDoc);
  } catch (err) {
    console.warn("Patrol stream alert fallback:", err);
  }
}
