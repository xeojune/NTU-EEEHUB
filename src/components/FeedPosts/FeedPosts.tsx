import React, { useEffect, useState } from 'react';
import { ContainerSm } from '../../styles/FeedPosts/FeedPostsStyle';
import SkeletonUI from '../SkeletonUI';
import FeedPost from './FeedPost';
import User1Img from '../../assets/userImg/User1.png';
import User1Post from '../../assets/userImg/User1post.png';
import User2Img from '../../assets/userImg/User2.png';
import User2Post from '../../assets/userImg/User2post.png';
import User3Img from '../../assets/userImg/User3.png';
import User3Post from '../../assets/userImg/User3post.png';
import User4Img from '../../assets/userImg/User4.png';
import User4Post from '../../assets/userImg/User4post.png';

const FeedPosts: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <ContainerSm>
      {/* Skeleton UI */}
      {isLoading &&
        [0, 1, 2, 3].map((_, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <SkeletonUI width="50px" height="50px" borderRadius="50%" />
              <SkeletonUI isText rows={2} width="300px" height="10px" />
            </div>
            <SkeletonUI width="100%" height="500px" marginTop="10px" borderRadius="8px" />
          </div>
        ))}

      {/* Render FeedPosts when loading is complete */}
      {!isLoading && (
        <>
          <FeedPost img={User1Post} username="dex_xeb" avatar={User1Img} />
          <FeedPost img={User2Post} username="katarinabluu" avatar={User2Img} />
          <FeedPost img={User3Post} username="eunwo.o_c" avatar={User3Img} />
          <FeedPost img={User4Post} username="imwinter" avatar={User4Img} />
        </>
      )}
    </ContainerSm>
  );
};

export default FeedPosts;
