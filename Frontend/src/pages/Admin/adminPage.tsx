import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { adminApi } from '../../apis/adminApi';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { FaSignOutAlt, FaPencilAlt } from 'react-icons/fa';
import ModalCard from '../../components/ModalCard';

// Styled Components
const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const StatValue = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const TabContainer = styled.div`
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  background: ${props => props.active ? '#007bff' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#e9ecef'};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
`;

const Tr = styled.tr``;

const ClickableRow = styled(Tr)`
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: rgba(0, 123, 255, 0.1);
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: #dc3545;
  color: white;
  cursor: pointer;
  &:hover {
    background: #c82333;
  }
`;

const EditButton = styled(ActionButton)`
  background: #28a745;
  margin-right: 8px;
  &:hover {
    background: #218838;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  margin-bottom: 20px;
  width: 300px;
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  &:hover {
    background: #c82333;
  }
`;

const EditableInput = styled.input`
  padding: 6px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin: 4px 0;
  width: 100%;
  color: #000;
`;

const ChartContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const ChartTitle = styled.h3`
  margin-bottom: 20px;
  color: #333;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  margin: 0 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &.save {
    background: #28a745;
    color: white;
  }
  &.cancel {
    background: #dc3545;
    color: white;
  }
`;

interface User {
  _id: string;
  name: string;
  email: string;
  followerCount: number;
  followingCount: number;
  totalPoints: number;
  profileImg: string;
}

interface Post {
  _id: string;
  username: string;
  userId: {
    username: string;
    email: string;
  };
  caption: string;
  points: number;
  totalLikes: number;
  totalComments: number;
  createdAt: Date;
}

interface UserGrowthData {
  date: string;
  followers: number;
  following: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalPoints: 0,
    averageEngagement: 0
  });

  const [chartTab, setChartTab] = useState<'points' | 'comments' | 'likes' | 'engagement'>('points');
  const [userChartTab, setUserChartTab] = useState<'points' | 'relations'>('points');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [showGrowthModal, setShowGrowthModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
  };

  const handleSave = async () => {
    try {
      if (editingItem._id) {
        if ('email' in editingItem) {
          // User edit
          await adminApi.updateUser(editingItem._id, editingItem);
          setUsers(users.map(user => 
            user._id === editingItem._id ? editingItem : user
          ));
        } else {
          // Post edit
          await adminApi.updatePost(editingItem._id, editingItem);
          setPosts(posts.map(post => 
            post._id === editingItem._id ? editingItem : post
          ));
        }
      }
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleUserRowClick = async (user: User) => {
    try {
      const growthData = await adminApi.getUserGrowthData(user._id);
      setUserGrowthData(growthData);
      setSelectedUser(user);
      setShowGrowthModal(true);
    } catch (error) {
      console.error('Error fetching user growth data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [usersData, postsData] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAllPosts()
      ]);

      setUsers(usersData);
      setPosts(postsData);

      // Calculate statistics
      const totalPoints = usersData.reduce((sum: number, user: User) => sum + user.totalPoints, 0);
      const avgEngagement = postsData.length > 0
        ? postsData.reduce((sum: number, post: Post) => sum + post.totalLikes + post.totalComments, 0) / postsData.length
        : 0;

      setStats({
        totalUsers: usersData.length,
        totalPosts: postsData.length,
        totalPoints: totalPoints,
        averageEngagement: Math.round(avgEngagement * 100) / 100
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminApi.deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await adminApi.deletePost(postId);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  // Prepare chart data
  const postEngagementData = posts.map(post => ({
    name: post.caption.substring(0, 20) + '...',
    likes: post.totalLikes,
    comments: post.totalComments,
    points: post.points
  })).sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments)).slice(0, 5);

  const userEngagementData = users.map(user => ({
    name: user.name,
    followers: user.followerCount,
    following: user.followingCount,
    points: user.totalPoints
  })).sort((a, b) => b.points - a.points).slice(0, 5);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(post =>
    post.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.caption.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </LogoutButton>
      </Header>

      <StatsContainer>
        <StatCard>
          <StatTitle>Total Users</StatTitle>
          <StatValue>{stats.totalUsers}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Posts</StatTitle>
          <StatValue>{stats.totalPosts}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Points</StatTitle>
          <StatValue>{stats.totalPoints}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Avg. Engagement</StatTitle>
          <StatValue>{stats.averageEngagement}</StatValue>
        </StatCard>
      </StatsContainer>

      <ChartContainer>
        <ChartTitle>Top 5 Posts Analysis</ChartTitle>
        <TabContainer>
          <TabButton active={chartTab === 'points'} onClick={() => setChartTab('points')}>
            Points Distribution
          </TabButton>
          <TabButton active={chartTab === 'comments'} onClick={() => setChartTab('comments')}>
            Comments Distribution
          </TabButton>
          <TabButton active={chartTab === 'likes'} onClick={() => setChartTab('likes')}>
            Likes Distribution
          </TabButton>
          <TabButton active={chartTab === 'engagement'} onClick={() => setChartTab('engagement')}>
            Total Engagement
          </TabButton>
        </TabContainer>
        
        <BarChart width={800} height={300} data={posts
          .sort((a, b) => {
            switch(chartTab) {
              case 'points':
                return b.points - a.points;
              case 'comments':
                return b.totalComments - a.totalComments;
              case 'likes':
                return b.totalLikes - a.totalLikes;
              case 'engagement':
                return (b.totalLikes + b.totalComments) - (a.totalLikes + a.totalComments);
              default:
                return 0;
            }
          })
          .slice(0, 5)
          .map(post => ({
            name: post.caption.substring(0, 20) + '...',
            value: chartTab === 'points' ? post.points :
                   chartTab === 'comments' ? post.totalComments :
                   chartTab === 'likes' ? post.totalLikes :
                   post.totalLikes + post.totalComments,
          }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="value" 
            barSize={30}
            fill={chartTab === 'points' ? '#ffc658' : 
                 chartTab === 'comments' ? '#82ca9d' :
                 chartTab === 'likes' ? '#8884d8' :
                 '#ff7300'} 
            name={chartTab === 'points' ? 'Points' :
                 chartTab === 'comments' ? 'Comments' :
                 chartTab === 'likes' ? 'Likes' :
                 'Total Engagement'} 
          />
        </BarChart>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>Top 5 Users Analysis</ChartTitle>
        <TabContainer>
          <TabButton active={userChartTab === 'points'} onClick={() => setUserChartTab('points')}>
            Points Distribution
          </TabButton>
          <TabButton active={userChartTab === 'relations'} onClick={() => setUserChartTab('relations')}>
            Relation Distribution
          </TabButton>
        </TabContainer>
        
        <LineChart width={800} height={300} data={users
          .sort((a, b) => {
            switch(userChartTab) {
              case 'points':
                return b.totalPoints - a.totalPoints;
              case 'relations':
                return (b.followerCount + b.followingCount) - (a.followerCount + a.followingCount);
              default:
                return 0;
            }
          })
          .slice(0, 5)
          .map(user => ({
            name: user.name,
            ...(userChartTab === 'points' 
              ? { value: user.totalPoints }
              : { 
                  followers: user.followerCount,
                  following: user.followingCount
                }
            ),
          }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {userChartTab === 'points' ? (
            <Line 
              type="monotone"
              dataKey="value" 
              stroke="#8884d8"
              name="Points"
              strokeWidth={2}
            />
          ) : (
            <>
              <Line 
                type="monotone"
                dataKey="followers" 
                stroke="#82ca9d"
                name="Followers"
                strokeWidth={2}
              />
              <Line 
                type="monotone"
                dataKey="following" 
                stroke="#ffc658"
                name="Following"
                strokeWidth={2}
              />
            </>
          )}
        </LineChart>
      </ChartContainer>

      <TabContainer>
        <TabButton
          active={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
        >
          Users
        </TabButton>
        <TabButton
          active={activeTab === 'posts'}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </TabButton>
      </TabContainer>

      <SearchInput
        type="text"
        placeholder={`Search ${activeTab}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {activeTab === 'users' ? (
        <Table>
          <thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Followers</Th>
              <Th>Following</Th>
              <Th>Points</Th>
              <Th>Actions</Th>
            </Tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <ClickableRow 
                key={user._id} 
                onClick={() => handleUserRowClick(user)}
              >
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.followerCount}</Td>
                <Td>{user.followingCount}</Td>
                <Td>{user.totalPoints}</Td>
                <Td>
                  <EditButton onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(user);
                  }}>
                    <FaPencilAlt />
                  </EditButton>
                  <ActionButton onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(user._id);
                  }}>
                    Delete
                  </ActionButton>
                </Td>
              </ClickableRow>
            ))}
          </tbody>
        </Table>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Username</Th>
              <Th>Caption</Th>
              <Th>Points</Th>
              <Th>Likes</Th>
              <Th>Comments</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map(post => (
              <tr key={post._id}>
                <Td>{post.userId?.username || post.username}</Td>
                <Td>{post.caption.substring(0, 50)}...</Td>
                <Td>{post.points}</Td>
                <Td>{post.totalLikes}</Td>
                <Td>{post.totalComments}</Td>
                <Td>{new Date(post.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <EditButton onClick={() => handleEdit(post)}>
                    <FaPencilAlt />
                  </EditButton>
                  <ActionButton onClick={() => handleDeletePost(post._id)}>
                    Delete
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {editingItem && (
        <Modal>
          <ModalContent>
            <h2>Edit {activeTab === 'users' ? 'User' : 'Post'}</h2>
            {activeTab === 'users' ? (
              <>
                <ModalInput
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  placeholder="Name"
                />
                <ModalInput
                  type="email"
                  value={editingItem.email}
                  onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                  placeholder="Email"
                />
                <ModalInput
                  type="number"
                  value={editingItem.totalPoints}
                  onChange={(e) => setEditingItem({...editingItem, totalPoints: parseInt(e.target.value)})}
                  placeholder="Points"
                />
              </>
            ) : (
              <>
                <ModalInput
                  type="text"
                  value={editingItem.caption}
                  onChange={(e) => setEditingItem({...editingItem, caption: e.target.value})}
                  placeholder="Caption"
                />
                <ModalInput
                  type="number"
                  value={editingItem.points}
                  onChange={(e) => setEditingItem({...editingItem, points: parseInt(e.target.value)})}
                  placeholder="Points"
                />
              </>
            )}
            <div>
              <ModalButton className="save" onClick={handleSave}>Save</ModalButton>
              <ModalButton className="cancel" onClick={() => setEditingItem(null)}>Cancel</ModalButton>
            </div>
          </ModalContent>
        </Modal>
      )}

      {showGrowthModal && selectedUser && (
        <ModalCard
          width="800px"
          height="500px"
          background='#fff'
          onClose={() => setShowGrowthModal(false)}
        >
          <div style={{ width: '100%', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#000' }}>{selectedUser.name}'s Growth Over Time</h2>
              <EditButton onClick={() => handleEdit(selectedUser)}>
                <FaPencilAlt />
              </EditButton>
            </div>
            {editingItem && editingItem._id === selectedUser._id ? (
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <div>
                  <label style={{ color: '#000' }}>Name:</label>
                  <EditableInput
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ color: '#000' }}>Email:</label>
                  <EditableInput
                    value={editingItem.email}
                    onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ color: '#000' }}>Points:</label>
                  <EditableInput
                    type="number"
                    value={editingItem.totalPoints}
                    onChange={(e) => setEditingItem({ ...editingItem, totalPoints: parseInt(e.target.value) })}
                  />
                </div>
                <button onClick={handleSave}>Save</button>
              </div>
            ) : null}
            <LineChart width={700} height={400} data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="#82ca9d"
                name="Followers"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="following"
                stroke="#ffc658"
                name="Following"
                strokeWidth={2}
              />
            </LineChart>
          </div>
        </ModalCard>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard;