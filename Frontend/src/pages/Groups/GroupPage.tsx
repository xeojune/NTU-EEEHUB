import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import Layout from '../Layout';
import { groupApi, Group } from '../../apis/groupApi';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { getUserProfile, UserProfile } from '../../apis/userApi';
import {
  Banner,
  ProfileSection,
  Avatar,
  ProfileInfo,
  GroupInfo,
  Grid,
  Card,
  InfoItem,
  Link,
  StatsContainer,
  SectionTitle,
  ContentContainer
} from '../../styles/Groups/GroupPageStyle';
import { FaMapMarkerAlt, FaPhone, FaGlobe, FaEnvelope, FaThumbsUp, FaFileAlt, FaSpinner, FaUsers, FaUserPlus, FaCalendar } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MessageTextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
`;

const ActionButton = styled.button<{ variant?: 'accept' | 'reject' }>`
  padding: 8px 16px;
  margin: 0 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  background-color: ${props => 
    props.variant === 'reject' ? '#ff4444' : 
    props.variant === 'accept' ? '#00C851' : 
    '#4285f4'};
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #1a73e8;
  font-size: 1.2rem;
  
  svg {
    animation: spin 1s linear infinite;
    margin-right: 12px;
  }
  
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const MemberCard = styled.div`
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .member-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .member-info {
    h3 {
      margin: 0 0 4px 0;
      font-size: 1.1rem;
      font-weight: 500;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      
      &.role {
        color: #1a73e8;
        font-weight: 500;
        text-transform: capitalize;
      }
    }
  }
  
  .actions {
    display: flex;
    gap: 8px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #666;
  
  svg {
    font-size: 3rem;
    color: #1a73e8;
    margin-bottom: 16px;
  }
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 1.2rem;
    color: #1a1a1a;
  }
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: 12px 16px;
  border: none;
  background: none;
  font-weight: ${props => props.isActive ? '600' : '400'};
  color: ${props => props.isActive ? '#1877f2' : '#65676b'};
  border-bottom: ${props => props.isActive ? '2px solid #1877f2' : 'none'};
  cursor: pointer;
  &:hover {
    background-color: #f0f2f5;
  }
`;

const TabPanel = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const EventCard = styled.div`
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: block;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .event-header h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 500;
  }
  
  .event-header .date {
    color: #666;
    font-size: 0.9rem;
  }
  
  .description {
    margin-bottom: 16px;
  }
  
  .event-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .event-footer .location {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 0.9rem;
  }
  
  .event-footer .created-by {
    color: #666;
    font-size: 0.9rem;
  }
`;

const CalendarSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;

  .react-calendar {
    width: 100%;
    border: none;
    
    .react-calendar__tile--hasContent {
      background-color: #e6f3ff;
      font-weight: bold;
    }
  }
`;

const EventsLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const EventDot = styled.div`
  height: 8px;
  width: 8px;
  background-color: #4a90e2;
  border-radius: 50%;
  margin: 2px auto 0;
`;

interface Event {
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

interface EventWithCreator extends Event {
  creatorProfile?: UserProfile;
}

interface MemberDetail {
  user: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member' | 'pending';
  joinedAt: string;
  message?: string;
}

const MemberCardComponent: React.FC<{
  member: MemberDetail;
  isAdmin: boolean;
  isCreator: boolean;
  handleRemoveMember: (userId: string) => void;
}> = ({ member, isAdmin, isCreator, handleRemoveMember }) => {
  const [avatar, setAvatar] = useState<string>("/default-avatar.png");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!member?.user) return;
      
      try {
        const userProfile = await getUserProfile(member.user);
        console.log('User Profile for', member.user, ':', userProfile);
        if (userProfile.profileImg) {
          console.log('Profile Image URL:', userProfile.profileImg);
          setAvatar(userProfile.profileImg.startsWith('http') 
            ? userProfile.profileImg 
            : `http://localhost:3000${userProfile.profileImg}`
          );
        } else {
          console.log('No profile image found for user:', member.user);
          setAvatar("/default-avatar.png");
        }
        // Set the username from user profile
        setUsername(userProfile.name);
      } catch (error) {
        console.error('Error fetching avatar for user', member.user, ':', error);
        setAvatar("/default-avatar.png");
      }
    };
    fetchAvatar();
  }, [member?.user]);

  if (!member?.user) return null;

  return (
    <MemberCard>
      <img 
        className="member-avatar"
        src={avatar}
        alt={`${username || member.name}'s avatar`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/default-avatar.png";
        }}
      />
      <div className="member-info">
        <h3>{member.name}</h3>
        <p className="role">{member.role}</p>
        <p className="username">@{username?.toLowerCase() || member.name?.toLowerCase()}</p>
        <p>Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
      </div>
      {(isAdmin || isCreator) && member.role !== 'admin' && (
        <div className="actions">
          <ActionButton 
            variant="reject"
            onClick={() => handleRemoveMember(member.user)}
          >
            Remove
          </ActionButton>
        </div>
      )}
    </MemberCard>
  );
};

const PendingRequestCard: React.FC<{
  member: MemberDetail;
  onAccept: (userId: string) => void;
  onReject: (userId: string) => void;
}> = ({ member, onAccept, onReject }) => {
  const [avatar, setAvatar] = useState<string>("/default-avatar.png");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!member?.user) return;
      
      try {
        const userProfile = await getUserProfile(member.user);
        if (userProfile.profileImg) {
          setAvatar(userProfile.profileImg.startsWith('http') 
            ? userProfile.profileImg 
            : `http://localhost:3000${userProfile.profileImg}`
          );
        } else {
          setAvatar("/default-avatar.png");
        }
        setUsername(userProfile.name);
      } catch (error) {
        console.error('Error fetching avatar for user', member.user, ':', error);
        setAvatar("/default-avatar.png");
      }
    };
    fetchAvatar();
  }, [member?.user]);

  if (!member?.user) return null;

  return (
    <MemberCard>
      <img 
        className="member-avatar"
        src={avatar}
        alt={`${username || member.name}'s avatar`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/default-avatar.png";
        }}
      />
      <div className="member-info">
        <h3>{username || member.name}</h3>
        {member.message && (
          <p style={{ marginBottom: '8px' }}>
            "{member.message}"
          </p>
        )}
        <p className="username">@{username?.toLowerCase() || member.name?.toLowerCase()}</p>
        <p>Requested {new Date(member.joinedAt).toLocaleDateString()}</p>
      </div>
      <div className="actions">
        <ActionButton 
          variant="accept"
          onClick={() => onAccept(member.user)}
        >
          Accept
        </ActionButton>
        <ActionButton 
          variant="reject"
          onClick={() => onReject(member.user)}
        >
          Reject
        </ActionButton>
      </div>
    </MemberCard>
  );
};

const GroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user, getUserAvatar } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [joinMessage, setJoinMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [events, setEvents] = useState<EventWithCreator[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (value: Date | Date[] | null) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value) && value.length > 0) {
      setSelectedDate(value[0]);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const fetchGroupData = async () => {
    if (!groupId) return;
    try {
      setIsLoading(true);
      const groupData = await groupApi.getGroupById(groupId);
      setGroup(groupData);
    } catch (error) {
      toast.error('Failed to fetch group data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!user?._id || !groupId) return;
    try {
      await groupApi.joinGroup({
        groupId,
        userId: user._id,
        message: joinMessage
      });
      toast.success('Join request sent successfully');
      await fetchGroupData();
      setJoinMessage('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to join group');
    }
  };

  const handleRespondToJoinRequest = async (userId: string, action: 'accept' | 'reject', message?: string) => {
    if (!user?._id || !groupId) return;
    try {
      await groupApi.respondToJoinRequest({
        groupId,
        userId,
        adminId: user._id,
        action,
        message
      });
      toast.success(`Successfully ${action}ed join request`);
      await fetchGroupData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} join request`);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!user?._id || !groupId) return;
    try {
      await groupApi.removeMember({
        groupId,
        userId,
        adminId: user._id
      });
      toast.success('Member removed successfully');
      await fetchGroupData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleLogoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !groupId) return;

    setUploading(true);
    try {
      const imageUrl = await groupApi.uploadGroupLogo(groupId, file);
      setGroup(prev => prev ? { ...prev, icon: imageUrl } : null);
      toast.success('Group logo updated successfully');
    } catch (error) {
      console.error('Error uploading group logo:', error);
      toast.error('Failed to upload group logo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEventFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || !user?._id) return;
    
    try {
      // Convert datetime-local values to ISO strings
      const eventData = {
        ...eventForm,
        startDate: new Date(eventForm.startDate).toISOString(),
        endDate: new Date(eventForm.endDate).toISOString(),
        groupId,
        createdBy: user._id,
      };
      
      console.log('Event data being sent:', eventData);
      
      const newEvent = await groupApi.createEvent(eventData);
      setEvents(prev => [newEvent, ...prev]);
      setShowEventForm(false);
      setEventForm({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
      });
      toast.success('Event created successfully');
    } catch (error: any) {
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!groupId || !user?._id) return;
    
    try {
      // Check if we have a valid MongoDB ObjectId
      if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid event ID format');
      }
      
      await groupApi.deleteEvent(groupId, eventId);
      setEvents(prev => prev.filter(event => event._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete event');
    }
  };

  const fetchEventCreatorProfiles = async (events: Event[]) => {
    try {
      const eventsWithCreators = await Promise.all(
        events.map(async (event) => {
          try {
            const creatorProfile = await getUserProfile(event.createdBy);
            return { ...event, creatorProfile };
          } catch (error) {
            console.error(`Failed to fetch creator profile for event ${event._id}:`, error);
            return event;
          }
        })
      );
      setEvents(eventsWithCreators);
    } catch (error) {
      console.error('Error fetching event creator profiles:', error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!groupId) return;
      try {
        const response = await groupApi.getGroupEvents(groupId);
        await fetchEventCreatorProfiles(response);
      } catch (error) {
        toast.error('Failed to fetch events');
      }
    };
    
    if (groupId) {
      fetchEvents();
    }
  }, [groupId]);

  const hasEventOnDate = (date: Date) => {
    return events.some(event => {
      const eventStart = new Date(event.startDate);
      return eventStart.toDateString() === date.toDateString();
    });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      return eventStart.toDateString() === date.toDateString();
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <ContentContainer>
          <LoadingSpinner>
            <FaSpinner /> Loading group information...
          </LoadingSpinner>
        </ContentContainer>
      </Layout>
    );
  }

  if (!group) {
    return (
      <Layout>
        <ContentContainer>
          Group not found
        </ContentContainer>
      </Layout>
    );
  }

  const isMember = user?._id ? group.members.includes(user._id) : false;
  const isAdmin = user?._id ? group.admins.includes(user._id) : false;
  const isCreator = user?._id ? group.creator === user._id : false;
  const hasPendingRequest = user?._id ? group.memberDetails.some(
    detail => detail.user === user._id && detail.role === 'pending'
  ) : false;

  const getJoinButtonText = () => {
    if (isMember) return 'Member';
    if (isAdmin) return 'Admin';
    if (isCreator) return 'Creator';
    if (hasPendingRequest) return 'Request Pending';
    return 'Join as Member';
  };

  return (
    <Layout>
      <ContentContainer>
        <Banner />

        <ProfileSection>
          <div style={{ position: 'relative' }}>
            <Avatar 
              src={group.icon || "/default-group-icon.png"} 
              alt={group.name}
              onClick={user && (group.creator === user._id || group.admins.includes(user._id)) ? handleLogoClick : undefined}
              style={{ cursor: user && (group.creator === user._id || group.admins.includes(user._id)) ? 'pointer' : 'default' }}
            />
            {uploading && (
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaSpinner style={{ color: 'white', fontSize: '2rem' }} className="fa-spin" />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
          </div>

          <ProfileInfo>
            <GroupInfo>
              <h1>{group.name}</h1>
              <p>@{group.handle} • {group.memberCount} Members • {group.privacy}</p>
            </GroupInfo>
            {!isMember && !isAdmin && !isCreator && !hasPendingRequest && (
              <div>
                <MessageTextArea
                  placeholder="Why do you want to join this group? (optional)"
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                />
                <ActionButton onClick={handleJoinGroup}>
                  {getJoinButtonText()}
                </ActionButton>
              </div>
            )}
            {hasPendingRequest && (
              <ActionButton disabled>
                Request Pending
              </ActionButton>
            )}
          </ProfileInfo>

          <TabList>
            <Tab isActive={activeTab === 0} onClick={() => setActiveTab(0)}>
              About
            </Tab>
            <Tab isActive={activeTab === 1} onClick={() => setActiveTab(1)}>
              Members
            </Tab>
            <Tab isActive={activeTab === 2} onClick={() => setActiveTab(2)}>
              Events
            </Tab>
            {(isAdmin || isCreator) && (
              <Tab isActive={activeTab === 3} onClick={() => setActiveTab(3)}>
                Requests
              </Tab>
            )}
          </TabList>
        </ProfileSection>

        <TabPanel isVisible={activeTab === 0}>
          <Grid>
            <Card>
              <SectionTitle>About</SectionTitle>
              <p>{group.description}</p>
            </Card>

            <Card>
              <SectionTitle>Contact Information</SectionTitle>
              {group.email && (
                <InfoItem>
                  <FaEnvelope /> <Link href={`mailto:${group.email}`}>{group.email}</Link>
                </InfoItem>
              )}
              {group.phone && (
                <InfoItem>
                  <FaPhone /> <span>{group.phone}</span>
                </InfoItem>
              )}
              {group.website && (
                <InfoItem>
                  <FaGlobe /> <Link href={group.website} target="_blank" rel="noopener noreferrer">{group.website}</Link>
                </InfoItem>
              )}
              {group.location && (
                <InfoItem>
                  <FaMapMarkerAlt /> <span>{group.location}</span>
                </InfoItem>
              )}
            </Card>

            <Card>
              <SectionTitle>Group Stats</SectionTitle>
              <StatsContainer>
                <InfoItem>
                  <FaThumbsUp /> <span>{group.memberCount} Members</span>
                </InfoItem>
                <InfoItem>
                  <FaFileAlt /> <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                </InfoItem>
              </StatsContainer>
            </Card>
          </Grid>
        </TabPanel>

        {/* Members Tab */}
        <TabPanel isVisible={activeTab === 1}>
          <Grid>
            <Card>
              <SectionTitle>Members ({group.memberCount})</SectionTitle>
              {group.memberDetails.filter(member => member.role !== 'pending').length === 0 ? (
                <EmptyState>
                  <FaUsers />
                  <h3>No Members Yet</h3>
                  <p>Be the first to join this group!</p>
                </EmptyState>
              ) : (
                group.memberDetails
                  .filter(member => member.role !== 'pending')
                  .map(member => (
                    <MemberCardComponent
                      key={member.user}
                      member={member}
                      isAdmin={isAdmin}
                      isCreator={isCreator}
                      handleRemoveMember={handleRemoveMember}
                    />
                  ))
              )}
            </Card>
          </Grid>
        </TabPanel>

        {/* Events Tab */}
        <TabPanel isVisible={activeTab === 2}>
          <Grid>
            <Card>
              <SectionTitle>
                Events
                {(isMember || isAdmin || isCreator) && (
                  <ActionButton 
                    onClick={() => setShowEventForm(!showEventForm)}
                    style={{ float: 'right', marginTop: '-5px' }}
                  >
                    {showEventForm ? 'Cancel' : 'Create Event'}
                  </ActionButton>
                )}
              </SectionTitle>

              {showEventForm && (
                <form onSubmit={handleEventFormSubmit} style={{ marginBottom: '20px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Event Title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                    <textarea
                      placeholder="Event Description"
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        minHeight: '100px'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={eventForm.location}
                      onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Start Date & Time</label>
                        <input
                          type="datetime-local"
                          value={eventForm.startDate}
                          onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                          required
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>End Date & Time</label>
                        <input
                          type="datetime-local"
                          value={eventForm.endDate}
                          onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                          required
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <ActionButton type="submit">Create Event</ActionButton>
                </form>
              )}

              <EventsLayout>
                <CalendarSection>
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    selectRange={false}
                    tileContent={({ date }) => hasEventOnDate(date) ? <EventDot /> : null}
                  />
                  {getEventsForDate(selectedDate).length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                      <h4>Events on {selectedDate.toDateString()}:</h4>
                      {getEventsForDate(selectedDate).map((event) => (
                        <Card key={event._id}>
                          <h5>{event.title}</h5>
                          <p>{event.description}</p>
                          <InfoItem>
                            <FaMapMarkerAlt /> {event.location}
                          </InfoItem>
                          <InfoItem>
                            <FaCalendar /> {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}
                          </InfoItem>
                          <InfoItem>
                            Created by: {event.creatorProfile?.name || 'Unknown User'}
                          </InfoItem>
                        </Card>
                      ))}
                    </div>
                  )}
                </CalendarSection>

                <EventsList>
                  {events.map(event => (
                    <EventCard key={event._id}>
                      <div className="event-header">
                        <h3>{event.title}</h3>
                        <span className="date">
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="description">{event.description}</p>
                      <div className="event-footer">
                        <span className="location">
                          <FaMapMarkerAlt /> {event.location}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span className="created-by">
                            Created by: @{event.creatorProfile?.name || 'Unknown User'}
                          </span>
                          {(isAdmin || isCreator || event.createdBy === user?._id) && (
                            <ActionButton 
                              variant="reject"
                              onClick={() => handleDeleteEvent(event._id)}
                              style={{ marginLeft: '10px' }}
                            >
                              Delete
                            </ActionButton>
                          )}
                        </div>
                      </div>
                    </EventCard>
                  ))}
                </EventsList>
              </EventsLayout>
            </Card>
          </Grid>
        </TabPanel>

        {/* Join Requests Tab - Only visible to admins and creator */}
        {(isAdmin || isCreator) && (
          <TabPanel isVisible={activeTab === 3}>
            <Grid>
              <Card>
                <SectionTitle>Pending Join Requests</SectionTitle>
                {group.memberDetails.filter(member => member.role === 'pending').length === 0 ? (
                  <EmptyState>
                    <FaUserPlus />
                    <h3>No Pending Requests</h3>
                    <p>There are no pending join requests at the moment.</p>
                  </EmptyState>
                ) : (
                  group.memberDetails
                    .filter(member => member.role === 'pending')
                    .map(member => (
                      <PendingRequestCard
                        key={member.user}
                        member={member}
                        onAccept={(userId) => handleRespondToJoinRequest(userId, 'accept')}
                        onReject={(userId) => handleRespondToJoinRequest(userId, 'reject')}
                      />
                    ))
                )}
              </Card>
            </Grid>
          </TabPanel>
        )}
      </ContentContainer>
    </Layout>
  );
};

export default GroupPage;