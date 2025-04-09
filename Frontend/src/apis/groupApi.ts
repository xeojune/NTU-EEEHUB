import axios from 'axios';

const groupApiInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
groupApiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface CreateGroupDto {
  name: string;
  handle: string;
  description?: string;
  privacy?: 'public' | 'private' | 'restricted';
  userId: string;
  settings?: {
    allowMemberPosts: boolean;
    allowMemberEvents: boolean;
    allowMemberFiles: boolean;
    requireAdminApproval: boolean;
  };
}

export interface JoinGroupDto {
  groupId: string;
  userId: string;
  message?: string;
}

export interface RespondToJoinRequestDto {
  groupId: string;
  userId: string;
  adminId: string;
  action: 'accept' | 'reject';
  message?: string;
}

export interface KickMemberDto {
  groupId: string;
  userId: string;
  adminId: string;
  reason?: string;
}

export interface SetAdminDto {
  groupId: string;
  userId: string;
  creatorId: string;
  action: 'add' | 'remove';
}

export interface Group {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  handle: string;
  description?: string;
  backgroundImage?: string;
  icon?: string;
  creator: string;
  admins: string[];
  members: string[];
  privacy: string;
  memberCount: number;
  createdAt: string;
  memberDetails: {
    user: string;
    name: string;
    avatar: string;
    role: 'admin' | 'moderator' | 'member' | 'pending';
    joinedAt: string;
    message?: string;
  }[];
}

export interface CreateEventDto {
  groupId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  createdBy: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  createdBy: string;
  createdAt: string;
  groupId: string;
}

export const groupApi = {
  createGroup(groupData: CreateGroupDto): Promise<Group> {
    return groupApiInstance.post('/groups', groupData).then(response => response.data);
  },

  getAllGroups(): Promise<Group[]> {
    return groupApiInstance.get('/groups').then(response => response.data);
  },

  getGroupById(groupId: string): Promise<Group> {
    return groupApiInstance.get(`/groups/${groupId}`).then(response => response.data);
  },

  joinGroup(joinData: JoinGroupDto): Promise<void> {
    return groupApiInstance.post('/groups/join', joinData);
  },

  respondToJoinRequest(respondData: RespondToJoinRequestDto): Promise<void> {
    return groupApiInstance.put('/groups/join/respond', respondData);
  },

  removeMember(kickData: KickMemberDto): Promise<void> {
    return groupApiInstance.put('/groups/kick', kickData);
  },

  setAdmin(adminData: SetAdminDto): Promise<void> {
    return groupApiInstance.put('/groups/admin', adminData);
  },

  async uploadGroupIcon(groupId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await groupApiInstance.post(
      `/groups/${groupId}/icon`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async uploadGroupBackground(groupId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await groupApiInstance.post(
      `/groups/${groupId}/background`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get signed URL for group icon
  getGroupIconUrl: async (groupId: string): Promise<string> => {
    const response = await groupApiInstance.get(`/groups/${groupId}/icon-url`);
    return response.data.url;
  },

  // Event related endpoints
  createEvent(eventData: CreateEventDto): Promise<Event> {
    const { groupId, ...eventBody } = eventData;
    return groupApiInstance.post(`/groups/${groupId}/events`, eventBody)
      .then(response => response.data);
  },

  getGroupEvents(groupId: string): Promise<Event[]> {
    return groupApiInstance.get(`/groups/${groupId}/events`)
      .then(response => response.data);
  },

  deleteEvent(groupId: string, eventId: string): Promise<void> {
    return groupApiInstance.delete(`/groups/${groupId}/events/${eventId}`)
      .then(response => response.data);
  },
};