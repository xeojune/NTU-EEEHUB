import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { groupApi, Group, CreateGroupDto } from '../../apis/groupApi';
import { toast } from 'react-toastify';
import {
  PageContainer,
  Header,
  Title,
  CreateButton,
  GroupList,
  GroupCard,
  GroupImage,
  GroupName,
  GroupDescription,
  MemberCount,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  ButtonGroup,
  Button,
  NoGroupsContainer,
  NoGroupsTitle,
  NoGroupsText
} from '../../styles/Groups/GroupListStyle';
import Layout from '../Layout';
import { useUser } from '../../context/UserContext';

export const GroupListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [handleError, setHandleError] = useState<string>('');
  const [createGroupData, setCreateGroupData] = useState<Omit<CreateGroupDto, 'userId'>>({
    name: '',
    handle: '',
    description: '',
    privacy: 'public',
    settings: {
      allowMemberPosts: true,
      allowMemberEvents: true,
      allowMemberFiles: true,
      requireAdminApproval: false,
    },
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const fetchedGroups = await groupApi.getAllGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      toast.error('Failed to fetch groups');
    } finally {
      setIsLoading(false);
    }
  };

  const validateHandle = (handle: string) => {
    if (handle.length < 3) {
      setHandleError('Handle must be at least 3 characters long');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(handle)) {
      setHandleError('Handle can only contain letters, numbers, underscores, and hyphens');
      return false;
    }
    setHandleError('');
    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'handle') {
      validateHandle(value);
    }
    setCreateGroupData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateHandle(createGroupData.handle)) {
      return;
    }
    if (!user?._id) {
      toast.error('You must be logged in to create a group');
      return;
    }
    try {
      const newGroup = await groupApi.createGroup({
        ...createGroupData,
        name: createGroupData.name.trim(),
        handle: createGroupData.handle.trim(),
        description: createGroupData.description?.trim(),
        userId: user._id,
      });
      
      await fetchGroups(); // Refresh the groups list
      toast.success('Group created successfully!');
      setShowCreateModal(false);
      navigate(`/groups/${newGroup.id}`);
    } catch (error: any) {
      console.error('Create group error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Failed to create group. Please try again.';
      toast.error(errorMessage);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <NoGroupsContainer>
          <NoGroupsTitle>Loading groups...</NoGroupsTitle>
        </NoGroupsContainer>
      );
    }

    if (groups.length === 0) {
      return (
        <NoGroupsContainer>
          <NoGroupsTitle>No Groups Found</NoGroupsTitle>
          <NoGroupsText>
            There are no groups yet. Be the first to create one!
          </NoGroupsText>
          <CreateButton onClick={() => setShowCreateModal(true)}>
            Create Your First Group
          </CreateButton>
        </NoGroupsContainer>
      );
    }

    return (
      <GroupList>
        {groups.map((group) => (
          <GroupCard key={group.id} onClick={() => navigate(`/groups/${group.id}`)}>
            <GroupImage backgroundImage={group.backgroundImage} />
            <GroupName>{group.name}</GroupName>
            <GroupDescription>{group.description}</GroupDescription>
            <MemberCount>{group.memberCount} members</MemberCount>
          </GroupCard>
        ))}
      </GroupList>
    );
  };

  return (
    <Layout>
      <PageContainer>
        <Header>
          <Title>Groups</Title>
          <CreateButton onClick={() => setShowCreateModal(true)}>
            Create Group
          </CreateButton>
        </Header>

        {renderContent()}

        {showCreateModal && (
          <ModalOverlay onClick={() => setShowCreateModal(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalTitle>Create New Group</ModalTitle>
              <Form onSubmit={handleCreateGroup}>
                <FormGroup>
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={createGroupData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="handle">Group Handle</Label>
                  <Input
                    id="handle"
                    name="handle"
                    value={createGroupData.handle}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., my-awesome-group"
                  />
                  {handleError && <span style={{ color: 'red', fontSize: '0.8rem' }}>{handleError}</span>}
                  <span style={{ color: '#666', fontSize: '0.8rem' }}>
                    This will be your group's unique identifier. Use only letters, numbers, underscores, and hyphens.
                    For example: "ntu-eee-2025" or "photography_club"
                  </span>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                  <TextArea
                    id="description"
                    name="description"
                    value={createGroupData.description}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="privacy">Privacy</Label>
                  <Select
                    id="privacy"
                    name="privacy"
                    value={createGroupData.privacy}
                    onChange={handleInputChange}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="restricted">Restricted</option>
                  </Select>
                </FormGroup>

                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Create
                  </Button>
                </ButtonGroup>
              </Form>
            </ModalContent>
          </ModalOverlay>
        )}
      </PageContainer>
    </Layout>
  );
};