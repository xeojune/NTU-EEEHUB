import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useOpenSocket } from '../../hooks/useOpenSocket';
import { Room } from './openChatActive';

interface OpenProps {
  onRoomSelect: (room: Room) => void;
  selectedRoomId: string | null;
}

const Open: React.FC<OpenProps> = ({ onRoomSelect, selectedRoomId }) => {
  const { socket } = useOpenSocket();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    // Fetch existing rooms
    fetch('http://localhost:3000/api/open-chat/rooms')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched rooms:', data);
        setRooms(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Error fetching rooms:', err);
        setRooms([]);
      });

    if (!socket) return;

    // Listen for room events
    socket.on('roomCreated', (room: Room) => {
      console.log('Room created event received:', room);
      if (!room || !room._id) {
        console.error('Invalid room data received:', room);
        return;
      }
      
      setRooms((prev) => {
        const prevRooms = Array.isArray(prev) ? prev : [];
        if (prevRooms.some(r => r._id === room._id)) {
          return prevRooms;
        }
        return [...prevRooms, room];
      });
    });

    socket.on('userJoined', ({ room }: { room: Room }) => {
      if (!room || !room._id) return;
      setRooms((prev) => {
        const prevRooms = Array.isArray(prev) ? prev : [];
        return prevRooms.map((r) => (r._id === room._id ? room : r));
      });
    });

    socket.on('userLeft', ({ room }: { room: Room }) => {
      if (!room || !room._id) return;
      setRooms((prev) => {
        const prevRooms = Array.isArray(prev) ? prev : [];
        return prevRooms.map((r) => (r._id === room._id ? room : r));
      });
    });

    return () => {
      socket.off('roomCreated');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [socket]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || !currentUserId) return;

    const formData = new FormData();
    formData.append('roomName', newRoomName);
    formData.append('userId', currentUserId);
    if (selectedAvatar) {
      formData.append('avatar', selectedAvatar);
    }

    try {
      const response = await fetch('http://localhost:3000/api/open-chat/rooms', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const room = await response.json();
      setIsCreateModalOpen(false);
      setNewRoomName('');
      setSelectedAvatar(null);
      setPreviewUrl(null);
      
      if (socket) {
        socket.emit('createRoom', room);
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = (room: Room) => {
    if (!socket || !currentUserId) {
      console.error('Cannot join room: missing socket connection or user ID');
      return;
    }
    
    socket.emit('joinOpenRoom', {
      roomId: room._id,
      userId: currentUserId
    }, (response: Room) => {
      console.log('Join room response:', response);
      if (response) {
        setRooms(prev => prev.map(r => 
          r._id === response._id ? response : r
        ));
        onRoomSelect(response);
      }
    });
  };

  const getParticipantsText = (participants: string[]) => {
    return `${participants.length} participant${participants.length !== 1 ? 's' : ''}`;
  };

  return (
    <Container>
      <HeaderContainer>
        <Heading>Open Chats</Heading>
        <CreateButton onClick={() => setIsCreateModalOpen(true)}>
          Create Room
        </CreateButton>
      </HeaderContainer>

      <RoomList>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <RoomItem
              key={room._id}
              isSelected={selectedRoomId === room._id}
              onClick={() => currentUserId && room.participants?.includes(currentUserId) && onRoomSelect(room)}
            >
              <RoomInfo>
                <div>{room.roomName}</div>
                <small>{room.participants?.length || 0} participants</small>
              </RoomInfo>
              {currentUserId && (!room.participants?.includes(currentUserId)) && (
                <JoinButton onClick={(e) => {
                  e.stopPropagation();
                  handleJoinRoom(room);
                }}>
                  Join
                </JoinButton>
              )}
            </RoomItem>
          ))
        ) : (
          <NoRoomsMessage>No open chat rooms available</NoRoomsMessage>
        )}
      </RoomList>

      {isCreateModalOpen && (
        <ModalOverlay onClick={() => setIsCreateModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Create Open Chat Room</ModalTitle>
              <CloseButton onClick={() => setIsCreateModalOpen(false)}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
              <Input
                type="text"
                placeholder="Room Name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                autoFocus
              />
              <AvatarUploadContainer>
                <label htmlFor="avatar-upload">
                  {previewUrl ? (
                    <AvatarPreview src={previewUrl} alt="Room avatar preview" />
                  ) : (
                    <AvatarPlaceholder>
                      Click to upload avatar
                    </AvatarPlaceholder>
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </AvatarUploadContainer>
            </ModalBody>
            <ModalFooter>
              <CancelButton onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </CancelButton>
              <SubmitButton onClick={handleCreateRoom}>
                Create
              </SubmitButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border-bottom: 1px solid #eef2f7;

  @media (max-width: 768px) {
    height: calc(100vh - 56px); // Adjust for mobile header
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CreateButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #357abd;
  }
`;

const RoomList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
`;

const RoomItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin: 5px 0;
  background-color: ${({ isSelected }) => isSelected ? '#e3e3e3' : '#f5f5f5'};
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e3e3e3;
  }
`;

const RoomInfo = styled.div`
  flex: 1;
`;

const JoinButton = styled.button`
  padding: 5px 15px;
  border-radius: 5px;
  border: none;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  margin-left: 10px;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #45a049;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 95%;
    margin: 0 10px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eef2f7;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: #1a1a1a;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;

  &:hover {
    color: #1a1a1a;
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #eef2f7;
  border-radius: 4px;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #eef2f7;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background: none;
  border: 1px solid #eef2f7;
  color: #666;

  &:hover {
    background-color: #f5f8fa;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #4a90e2;
  color: white;
  border: none;

  &:hover {
    background-color: #357abd;
  }
`;

const NoRoomsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const AvatarUploadContainer = styled.div`
  margin: 15px 0;
  cursor: pointer;
`;

const AvatarPreview = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
`;

const AvatarPlaceholder = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
  color: #666;
  font-size: 14px;
`;

export default Open;