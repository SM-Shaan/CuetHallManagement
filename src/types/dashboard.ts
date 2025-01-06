export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  category: 'General' | 'Academic' | 'Maintenance' | 'Event' | 'Emergency';
  priority: 'High' | 'Medium' | 'Low';
  publishDate: string;
  expiryDate: string;
  author: Author;
  status: 'Draft' | 'Published' | 'Expired';
  isPinned: boolean;
  views: number;
  comments: number;
  attachments?: Attachment[];
} 